import { useState, useEffect } from 'react';
import { Platform } from 'react-native';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      return;
    }

    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
      console.log('Status de conexão:', navigator.onLine ? 'Online' : 'Offline');
    };

    // Definir estado inicial
    updateOnlineStatus();

    // Adicionar event listeners
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  return isOnline;
}
