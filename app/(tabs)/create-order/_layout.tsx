import { Stack } from 'expo-router';

export default function OrderLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="product-search" />
      <Stack.Screen name="select-client" />
      <Stack.Screen name="select-payment" />
      <Stack.Screen name="complete" />
    </Stack>
  );
}