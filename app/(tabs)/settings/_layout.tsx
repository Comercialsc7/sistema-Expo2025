import { Stack } from 'expo-router';

export default function SettingsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="banner-management" />
      <Stack.Screen name="brand-management" />
      <Stack.Screen name="accelerator-management" />
    </Stack>
  );
}