import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Image as ImageIcon, Package, Diamond, ChevronRight, Calendar } from 'lucide-react-native';
import { useBannerStore } from '../../../store/useBannerStore';

const settingsOptions = [
  {
    id: 'banners',
    title: 'Banners Promocionais',
    description: 'Gerencie os banners do carrossel principal',
    icon: ImageIcon,
    route: '/(app)/settings/banner-management',
    getCount: (state: any) => state.banners?.length || 0,
  },
  {
    id: 'brands',
    title: 'Marcas',
    description: 'Cadastre e gerencie as marcas disponíveis',
    icon: Package,
    route: '/(app)/settings/brand-management',
    getCount: () => 12, // This would be dynamic once we have brand management
  },
  {
    id: 'accelerators',
    title: 'Produtos Aceleradores',
    description: 'Configure os produtos com status de acelerador',
    icon: Diamond,
    route: '/(app)/settings/accelerator-management',
    getCount: () => 8, // This would be dynamic once we have accelerator management
  },
  {
    id: 'payment-terms',
    title: 'Prazos de Pagamento',
    description: 'Configure os prazos de pagamento disponíveis',
    icon: Calendar,
    route: '/(app)/settings/payment-terms',
    getCount: () => 3, // This would be dynamic once we have payment terms management
  },
];

export default function SettingsScreen() {
  const bannerState = useBannerStore();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Configurações</Text>
        </View>
      </View>

      <View style={styles.content}>
        {settingsOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={styles.optionCard}
            onPress={() => router.push(option.route as any)}
          >
            <View style={styles.optionIcon}>
              <option.icon size={24} color="#003B71" />
            </View>
            <View style={styles.optionInfo}>
              <Text style={styles.optionTitle}>{option.title}</Text>
              <Text style={styles.optionDescription}>{option.description}</Text>
            </View>
            <View style={styles.optionRight}>
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{option.getCount(bannerState)}</Text>
              </View>
              <ChevronRight size={20} color="#666666" />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    paddingTop: Platform.OS === 'web' ? 16 : 48,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerContent: {
    marginLeft: Platform.OS === 'web' ? 56 : 0,
  },
  headerTitle: {
    fontSize: 24,
    color: '#003B71',
    fontFamily: 'Montserrat-Bold',
  },
  content: {
    padding: 16,
    gap: 16,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }
    }),
  },
  optionIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#F0F7FF',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    color: '#003B71',
    fontFamily: 'Montserrat-Bold',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'Montserrat-Regular',
  },
  optionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  countBadge: {
    backgroundColor: '#E5F0FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countText: {
    fontSize: 12,
    color: '#003B71',
    fontFamily: 'Montserrat-Bold',
  },
}); 