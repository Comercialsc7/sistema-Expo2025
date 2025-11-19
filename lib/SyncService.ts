import LocalDB from './LocalDB';
import { supabase } from './supabase';

export type SyncEventType = 'sync-start' | 'sync-progress' | 'sync-completed' | 'sync-error';

export interface SyncEvent {
  type: SyncEventType;
  message?: string;
  progress?: number;
  total?: number;
  error?: Error;
  data?: any;
}

export interface SyncConfig {
  tables: string[];
  batchSize?: number;
  onProgress?: (event: SyncEvent) => void;
}

type EventListener = (event: SyncEvent) => void;

export class SyncService {
  private static listeners: Map<SyncEventType, EventListener[]> = new Map();
  private static isSyncing = false;
  private static lastSyncTime: Record<string, Date> = {};

  static on(eventType: SyncEventType, listener: EventListener): void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)!.push(listener);
  }

  static off(eventType: SyncEventType, listener: EventListener): void {
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private static emit(event: SyncEvent): void {
    const listeners = this.listeners.get(event.type);
    if (listeners) {
      listeners.forEach((listener) => listener(event));
    }
  }

  static async upload(config?: Partial<SyncConfig>): Promise<{
    success: number;
    failed: number;
    errors: Array<{ table: string; error: Error }>;
  }> {
    const results = {
      success: 0,
      failed: 0,
      errors: [] as Array<{ table: string; error: Error }>,
    };

    try {
      this.emit({ type: 'sync-start', message: 'Iniciando upload...' });

      const allTables = await LocalDB.getAllTables();
      const records = [];

      for (const table of allTables) {
        const tableRecords = await LocalDB.getAll(table);
        const unsyncedRecords = tableRecords.filter(
          (record) => !record.payload._synced
        );
        records.push(...unsyncedRecords);
      }

      if (records.length === 0) {
        this.emit({
          type: 'sync-progress',
          message: 'Nenhum registro para sincronizar',
          progress: 0,
          total: 0,
        });
        return results;
      }

      const total = records.length;
      let processed = 0;

      for (const record of records) {
        try {
          const { table, payload } = record;
          const cleanPayload = { ...payload };
          delete cleanPayload._synced;
          delete cleanPayload._id;
          delete cleanPayload._createdAt;
          delete cleanPayload._updatedAt;

          const { error } = await supabase.from(table).upsert(cleanPayload);

          if (error) {
            throw error;
          }

          await LocalDB.remove(table, record._id);

          results.success++;
          processed++;

          this.emit({
            type: 'sync-progress',
            message: `Sincronizando ${processed}/${total}`,
            progress: processed,
            total,
          });
        } catch (error) {
          results.failed++;
          results.errors.push({
            table: record.table,
            error: error as Error,
          });
          console.error(`Erro ao sincronizar registro da tabela ${record.table}:`, error);
        }
      }

      return results;
    } catch (error) {
      this.emit({
        type: 'sync-error',
        message: 'Erro durante upload',
        error: error as Error,
      });
      throw error;
    }
  }

  static async download(config: SyncConfig): Promise<{
    downloaded: Record<string, number>;
    errors: Array<{ table: string; error: Error }>;
  }> {
    const results = {
      downloaded: {} as Record<string, number>,
      errors: [] as Array<{ table: string; error: Error }>,
    };

    try {
      this.emit({ type: 'sync-start', message: 'Iniciando download...' });

      const { tables } = config;
      const total = tables.length;
      let processed = 0;

      for (const table of tables) {
        try {
          const lastSync = this.lastSyncTime[table];
          let query = supabase.from(table).select('*');

          if (lastSync) {
            query = query.gt('updated_at', lastSync.toISOString());
          }

          const { data, error } = await query;

          if (error) {
            throw error;
          }

          if (data && data.length > 0) {
            await LocalDB.clear(table);

            for (const record of data) {
              await LocalDB.save(table, {
                ...record,
                _synced: true,
              });
            }

            results.downloaded[table] = data.length;
          } else {
            results.downloaded[table] = 0;
          }

          this.lastSyncTime[table] = new Date();
          processed++;

          this.emit({
            type: 'sync-progress',
            message: `Baixando ${table} (${processed}/${total})`,
            progress: processed,
            total,
          });
        } catch (error) {
          results.errors.push({
            table,
            error: error as Error,
          });
          console.error(`Erro ao baixar dados da tabela ${table}:`, error);
        }
      }

      return results;
    } catch (error) {
      this.emit({
        type: 'sync-error',
        message: 'Erro durante download',
        error: error as Error,
      });
      throw error;
    }
  }

  static async sync(config: SyncConfig): Promise<{
    upload: {
      success: number;
      failed: number;
      errors: Array<{ table: string; error: Error }>;
    };
    download: {
      downloaded: Record<string, number>;
      errors: Array<{ table: string; error: Error }>;
    };
  }> {
    if (this.isSyncing) {
      throw new Error('Sincronização já em andamento');
    }

    this.isSyncing = true;

    try {
      this.emit({ type: 'sync-start', message: 'Iniciando sincronização completa...' });

      const uploadResults = await this.upload(config);

      const downloadResults = await this.download(config);

      const hasErrors =
        uploadResults.failed > 0 ||
        downloadResults.errors.length > 0;

      if (hasErrors) {
        this.emit({
          type: 'sync-completed',
          message: 'Sincronização concluída com erros',
          data: {
            upload: uploadResults,
            download: downloadResults,
          },
        });
      } else {
        this.emit({
          type: 'sync-completed',
          message: 'Sincronização concluída com sucesso',
          data: {
            upload: uploadResults,
            download: downloadResults,
          },
        });
      }

      return {
        upload: uploadResults,
        download: downloadResults,
      };
    } catch (error) {
      this.emit({
        type: 'sync-error',
        message: 'Erro durante sincronização',
        error: error as Error,
      });
      throw error;
    } finally {
      this.isSyncing = false;
    }
  }

  static async uploadTable(table: string): Promise<{
    success: number;
    failed: number;
    errors: Array<{ error: Error }>;
  }> {
    const results = {
      success: 0,
      failed: 0,
      errors: [] as Array<{ error: Error }>,
    };

    try {
      const records = await LocalDB.getAll(table);
      const unsyncedRecords = records.filter((record) => !record.payload._synced);

      for (const record of unsyncedRecords) {
        try {
          const cleanPayload = { ...record.payload };
          delete cleanPayload._synced;
          delete cleanPayload._id;
          delete cleanPayload._createdAt;
          delete cleanPayload._updatedAt;

          const { error } = await supabase.from(table).upsert(cleanPayload);

          if (error) {
            throw error;
          }

          await LocalDB.remove(table, record._id);
          results.success++;
        } catch (error) {
          results.failed++;
          results.errors.push({ error: error as Error });
        }
      }

      return results;
    } catch (error) {
      throw error;
    }
  }

  static async downloadTable(table: string, fullRefresh = false): Promise<number> {
    try {
      const lastSync = fullRefresh ? null : this.lastSyncTime[table];
      let query = supabase.from(table).select('*');

      if (lastSync) {
        query = query.gt('updated_at', lastSync.toISOString());
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        if (fullRefresh) {
          await LocalDB.clear(table);
        }

        for (const record of data) {
          await LocalDB.save(table, {
            ...record,
            _synced: true,
          });
        }

        this.lastSyncTime[table] = new Date();
        return data.length;
      }

      return 0;
    } catch (error) {
      throw error;
    }
  }

  static isSyncInProgress(): boolean {
    return this.isSyncing;
  }

  static getLastSyncTime(table?: string): Date | Record<string, Date> | null {
    if (table) {
      return this.lastSyncTime[table] || null;
    }
    return this.lastSyncTime;
  }

  static clearListeners(): void {
    this.listeners.clear();
  }
}

export default SyncService;
