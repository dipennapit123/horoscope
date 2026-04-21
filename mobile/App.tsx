import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
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
import { SessionBootstrap } from "./src/components/SessionBootstrap";
import { colors } from "./src/theme";
import { getMissingPublicEnvKeys } from "./src/config/publicEnv";
import "./src/services/firebase";

void SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const missingFirebaseEnv = getMissingPublicEnvKeys();

  useEffect(() => {
    if (!fontsLoaded) return;
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.style = [
      Text.defaultProps.style,
      { fontFamily: "Poppins_400Regular" },
    ];
  }, [fontsLoaded]);

  if (missingFirebaseEnv.length > 0 && !__DEV__) {
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
          <Text style={{ color: "#64748b", marginTop: 10, lineHeight: 20 }}>
            Dev mode allows the app to start, but sign-in may fail until these are set.
          </Text>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <ToastProvider>
        <SafeAreaProvider>
          <SafeAreaView
            style={{ flex: 1, backgroundColor: colors.background }}
          >
            <StatusBar style="light" />
            <SessionBootstrap fontsLoaded={fontsLoaded}>
              <AppNavigator />
            </SessionBootstrap>
          </SafeAreaView>
        </SafeAreaProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}
