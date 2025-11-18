import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react-native';

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();

  if (Platform.OS !== 'web' || isOnline) {
    return null;
  }

  return (
    <View style={styles.container}>
      <WifiOff color="#FFFFFF" size={16} />
      <Text style={styles.text}>Você está offline</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});
