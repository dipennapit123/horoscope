import React from "react";
import { StatusBar } from "expo-status-bar";
import {
  SafeAreaProvider,
  SafeAreaView,
} from "react-native-safe-area-context";
import { Text } from "react-native";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { AppNavigator } from "./src/AppNavigator";
import { ToastProvider } from "./src/context/ToastContext";
import { ErrorBoundary } from "./src/components/ErrorBoundary";
import { colors } from "./src/theme";

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  // Apply funky font globally to all Text
  // (component-level overrides can still change fontFamily if needed)
  // eslint-disable-next-line react/jsx-no-constructed-context-values
  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.style = [
    Text.defaultProps.style,
    { fontFamily: "Poppins_400Regular" },
  ];

  const publishableKey =
    process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";

  return (
    <ErrorBoundary>
      <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
        <ToastProvider>
          <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
              <StatusBar style="light" />
              <AppNavigator />
            </SafeAreaView>
          </SafeAreaProvider>
        </ToastProvider>
      </ClerkProvider>
    </ErrorBoundary>
  );
}
