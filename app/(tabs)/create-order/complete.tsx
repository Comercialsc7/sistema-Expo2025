import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { MoreVertical } from 'lucide-react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSpinResultsStore } from '../../../store/useSpinResultsStore';
import { useNavigation } from '../../../hooks/useNavigation';
import { useOrderStore } from '../../../store/useOrderStore';
import { useCachedOrdersStore } from '../../../store/useCachedOrdersStore';

interface SpinResult {
  prize: string;
  photoUri?: string;
}

const Diamond = require('../../../assets/images/diamond.png');

export default function FinalizarPedido() {
  const params = useLocalSearchParams();
  const { goBack, navigateTo } = useNavigation();
  const { items: orderItems, client, paymentTerm, clearOrder } = useOrderStore();
  const { addCachedOrder } = useCachedOrdersStore();
  const { results, clearResults } = useSpinResultsStore();

  const subtotal = Number(params.subtotal) || 0;
  const itens = Number(params.itens) || 0;
  const desconto = Number(params.desconto) || 0;
  const total = Number(params.total) || 0;
  const prazo = Number(params.prazo) || 0;
  const faltaMoto = 5000 - (total % 5000) || 0;

  const girosGanhos = Math.floor(total / 3000);
  const girosRestantes = girosGanhos - results.length;
  const faltaGiro = 3000 - (total % 3000) || 0;

  const handleFinalizeOrder = () => {
    if (!client || !paymentTerm || orderItems.length === 0) {
      console.log("Pedido incompleto. Não pode finalizar.");
      return;
    }

    const orderToCache = {
      id: Date.now().toString(),
      items: orderItems,
      client: client,
      paymentTerm: paymentTerm,
      timestamp: new Date().toISOString(),
      subtotal: subtotal,
      total: total,
      discount: desconto,
      spinPrize: results.length > 0 ? {
        type: 'product' as const,
        description: results[0].prize,
        photo: results[0].photoUri
      } : undefined
    };

    addCachedOrder(orderToCache);
    clearOrder();

    navigateTo('/sync-orders');
  };

  useEffect(() => {
    return () => {
      clearResults();
    };
  }, []);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Top Section */}
        <View style={styles.topSection}>
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Finalizar Pedido</Text>
          </View>
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>R$ {subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Itens Adicionados</Text>
              <Text style={styles.summaryValue}>{itens}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Desconto</Text>
              <Text style={styles.summaryValue}>R$ {desconto.toFixed(2)}</Text>
            </View>
            <View style={styles.dashedLine} />
            <View style={[styles.summaryRow, { marginBottom: 0 }]}> 
              <Text style={styles.summaryTotalLabel}>Total</Text>
              <Text style={styles.summaryTotalValue}>R$ {total.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryPrazoRow}>
              <Text style={styles.summaryPrazo}>Prazo de pagamento</Text>
              <Text style={styles.summaryPrazoValor}>{prazo} dias</Text>
            </View>
          </View>
          {/* Bonus Section */}
          {girosGanhos > 0 && (
            <View style={styles.bonusBox}>
              <Image source={Diamond} style={[styles.diamondIcon, styles.diamondLeft]} />
              {girosRestantes > 0 ? (
                 <Text style={styles.bonusText}>Você Tem {girosRestantes} Giro(s) Restante(s)</Text>
              ) : (
                 <Text style={styles.bonusText}>Você Usou Todos os Seus Giros</Text>
              )}
              <Image source={Diamond} style={[styles.diamondIcon, styles.diamondRight]} />
            </View>
          )}

          {/* Seção de Prêmios Ganhos (aparece se houver resultados na store) */}
          {results.length > 0 && (
            <View style={styles.wonPrizesBox}>
              <Text style={styles.wonPrizesTitle}>Prêmios Ganhos:</Text>
              {results.map((result, index) => (
                <View key={index} style={styles.wonPrizeItem}>
                  <Text style={styles.wonPrizeText}>- {result.prize}</Text>
                  {result.photoUri && (
                    <Image source={{ uri: result.photoUri }} style={styles.wonPrizeImage} />
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Novo label: quanto falta para o próximo giro da sorte */}
          {girosRestantes === 0 && faltaGiro > 0 && (
             <View style={styles.giroLabelBox}>
              <Text style={styles.giroLabelText}>Faltam <Text style={styles.giroLabelValue}>R$ {faltaGiro.toFixed(2)}</Text> para o próximo giro da sorte</Text>
            </View>
          )}
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <Text style={styles.remainingLabel}>Faltam</Text>
          <View style={styles.remainingValueBox}>
            <Text style={styles.remainingValue}>R$ {faltaMoto.toFixed(2)}</Text>
          </View>
          <Text style={styles.remainingDesc}>para você concorrer{"\n"}a uma moto 0km</Text>
          
          <TouchableOpacity style={styles.addButton} onPress={goBack}>
            <Text style={styles.addButtonText}>Adicionar mais itens</Text>
          </TouchableOpacity>

          {/* Botão Girar Roleta (aparece se tiver giros restantes) */}
          {girosRestantes > 0 && ( 
            <TouchableOpacity style={styles.spinButton} onPress={() => navigateTo('/(tabs)/create-order/spin-wheel', { 
              girosDisponiveis: girosRestantes,
              subtotal: subtotal,
              itens: itens,
              desconto: desconto,
              total: total,
              prazo: prazo,
              girosGanhosInicial: girosGanhos
            })}>
              <Text style={styles.spinButtonText}>Girar Roleta</Text>
            </TouchableOpacity>
          )}

          {/* Botão Finalizar Pedido (aparece se não tiver giros restantes) */}
          {girosRestantes === 0 && ( 
            <TouchableOpacity 
              style={styles.finishButton} 
              onPress={handleFinalizeOrder}
            >
               <Text style={styles.finishButtonText}>Finalizar Pedido</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#003B71',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  topSection: {
    backgroundColor: '#1560A8',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 0,
    alignItems: 'stretch',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 18,
  },
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 22,
  },
  summaryBox: {
    paddingHorizontal: 0,
    paddingBottom: 8,
    backgroundColor: 'transparent',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  summaryLabel: {
    color: '#fff',
    fontSize: 14,
  },
  summaryValue: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
  },
  dashedLine: {
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#B0BEC5',
    marginVertical: 8,
  },
  summaryTotalLabel: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  summaryTotalValue: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  summaryPrazoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryPrazo: {
    color: '#fff',
    fontSize: 13,
    opacity: 0.8,
  },
  summaryPrazoValor: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  bonusBox: {
    backgroundColor: '#FFC72C',
    marginHorizontal: 0,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
    marginTop: 32,
    position: 'relative',
    paddingVertical: 40,
    minHeight: 100,
    borderWidth: 2,
    borderColor: '#941b80',
  },
  bonusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    flex: 1,
  },
  diamondIcon: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
    position: 'absolute',
    top: '50%',
    marginTop: -18,
  },
  diamondLeft: {
    left: -18,
  },
  diamondRight: {
    right: -18,
  },
  bottomSection: {
    backgroundColor: '#003B71',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  remainingLabel: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  remainingValueBox: {
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 2,
    marginVertical: 2,
  },
  remainingValue: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 28,
  },
  remainingDesc: {
    color: '#fff',
    fontSize: 14,
    marginVertical: 6,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#1560A8',
    borderRadius: 12,
    marginTop: 18,
    paddingVertical: 12,
    alignItems: 'center',
    width: '100%',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
  },
  spinButton: {
    backgroundColor: '#941b80',
    borderRadius: 12,
    marginTop: 12,
    paddingVertical: 12,
    alignItems: 'center',
    width: '100%',
  },
  spinButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
  },
  finishButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 12,
    paddingVertical: 12,
    alignItems: 'center',
    width: '100%',
  },
  finishButtonText: {
    color: '#003B71',
    fontWeight: 'bold',
    fontSize: 17,
  },
  giroLabelBox: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 0,
  },
  giroLabelText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  giroLabelValue: {
    color: '#FF3B30',
    fontWeight: 'bold',
  },
  wonPrizesBox: {
    marginTop: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#003B71',
    borderRadius: 12,
    width: '100%',
  },
  wonPrizesTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
  },
  wonPrizeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  wonPrizeText: {
    color: '#fff',
    fontSize: 16,
    marginRight: 8,
  },
  wonPrizeImage: {
    width: 50,
    height: 50,
    resizeMode: 'cover',
    borderRadius: 8,
  },
});