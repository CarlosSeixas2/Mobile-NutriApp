import { Stack } from "expo-router";
// import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    // <SafeAreaProvider>
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="app" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register-step-1" />
      <Stack.Screen name="register-step-2" />
    </Stack>
    // </SafeAreaProvider>
  );
}
