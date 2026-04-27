import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import '../global.css';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#F5F5F5' },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="supply-points/index"
          options={{
            headerShown: true,
            title: 'Odběrná místa',
            headerTintColor: '#00A651',
          }}
        />
        <Stack.Screen
          name="supply-points/[id]"
          options={{
            headerShown: true,
            title: 'Detail odběrného místa',
            headerTintColor: '#00A651',
          }}
        />
        <Stack.Screen
          name="invoices/[id]"
          options={{
            headerShown: true,
            title: 'Detail faktury',
            headerTintColor: '#00A651',
          }}
        />
        <Stack.Screen
          name="contracts/[id]"
          options={{
            headerShown: true,
            title: 'Detail smlouvy',
            headerTintColor: '#00A651',
          }}
        />
        <Stack.Screen
          name="notifications"
          options={{
            headerShown: true,
            title: 'Upozornění',
            headerTintColor: '#00A651',
          }}
        />
        <Stack.Screen
          name="calculator"
          options={{
            headerShown: true,
            title: 'Kalkulačka cen',
            headerTintColor: '#00A651',
          }}
        />
      </Stack>
    </>
  );
}
