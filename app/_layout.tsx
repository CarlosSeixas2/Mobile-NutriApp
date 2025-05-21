import { FormProvider } from "@/context/FormContext";
import { UserProvider } from "@/context/UserContext";
import { Stack } from "expo-router";
// import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <FormProvider>
      <UserProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="app" />
          <Stack.Screen name="login" />
          <Stack.Screen name="multiStepForm" />
        </Stack>
      </UserProvider>
    </FormProvider>

    // <SafeAreaProvider>

    // </SafeAreaProvider>
  );
}
