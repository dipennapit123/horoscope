import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  SafeAreaProvider,
  SafeAreaView,
} from "react-native-safe-area-context";
import { Text } from "react-native";
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
import { getMissingPublicEnvKeys } from "./src/config/publicEnv";
import "./src/services/firebase";

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  // Values come from app.config.js → expo.extra (see publicEnv.ts); works in dev + EAS.
  const missingFirebaseEnv = getMissingPublicEnvKeys();

  // Don't block app start on font loading (this makes splash screen feel slow).
  // Instead, apply the font once it's ready.
  useEffect(() => {
    if (!fontsLoaded) return;
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.style = [
      Text.defaultProps.style,
      { fontFamily: "Poppins_400Regular" },
    ];
  }, [fontsLoaded]);

  if (missingFirebaseEnv.length > 0) {
    return (
      <SafeAreaProvider>
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: colors.background,
            justifyContent: "center",
            paddingHorizontal: 20,
          }}
        >
          <StatusBar style="light" />
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>
            Configuration error
          </Text>
          <Text style={{ color: "#94a3b8", marginTop: 10, lineHeight: 20 }}>
            Missing Firebase env values: {missingFirebaseEnv.join(", ")}
          </Text>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <ErrorBoundary>
      <ToastProvider>
        <SafeAreaProvider>
          <SafeAreaView
            style={{ flex: 1, backgroundColor: colors.background }}
          >
            <StatusBar style="light" />
            <AppNavigator />
          </SafeAreaView>
        </SafeAreaProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}
