import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../AppNavigator";
import { useSessionStore } from "../store/useSessionStore";
import { api } from "../services/api";
import { getTimezone } from "../services/activity";
import { useOAuth, useAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { ZodiacLogoRing } from "../components/ZodiacLogoRing";

type Props = NativeStackScreenProps<RootStackParamList, "Auth">;

const PRIMARY = "#7f13ec";
const BACKGROUND_DARK = "#191022";

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const setAuth = useSessionStore((s) => s.setAuth);
  const token = useSessionStore((s) => s.token);
  const clerkUserId = useSessionStore((s) => s.clerkUserId);
  const zodiacSign = useSessionStore((s) => s.zodiacSign);
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();

  const [isLoading, setIsLoading] = useState(false);

  const showContinueButton = (isSignedIn && !!user) || !!(token && clerkUserId);

  const handleContinue = async () => {
    const route = zodiacSign ? { name: "Main" as const } : { name: "Onboarding" as const };

    if (token && clerkUserId) {
      navigation.reset({ index: 0, routes: [route] });
      return;
    }

    if (!user) return;
    try {
      const jwt = await getToken();
      if (!jwt) return;
      try {
        await api.post("/users/sync-clerk-user", {
          clerkUserId: user.id,
          email: user.primaryEmailAddress?.emailAddress ?? "",
          fullName: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
          avatarUrl: user.imageUrl,
          timezone: getTimezone(),
        });
      } catch {
        // ignore
      }
      setAuth({ clerkUserId: user.id, token: jwt });
      navigation.reset({ index: 0, routes: [route] });
    } catch {
      Alert.alert("Error", "Could not continue. Please try again.");
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await startOAuthFlow();
      const { createdSessionId, setActive } = result;

      if (!createdSessionId) {
        setIsLoading(false);
        return;
      }

      if (setActive) {
        await setActive({ session: createdSessionId });
      }

      try {
        const jwt = await getToken();
        if (jwt && user) {
          try {
            await api.post("/users/sync-clerk-user", {
              clerkUserId: user.id,
              email: user.primaryEmailAddress?.emailAddress ?? "",
              fullName: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
              avatarUrl: user.imageUrl,
              timezone: getTimezone(),
            });
          } catch {
            // ignore
          }
          setAuth({ clerkUserId: user.id, token: jwt });
        }
      } catch {
        // token may not be ready yet
      }

      setIsLoading(false);
    } catch (err: unknown) {
      setIsLoading(false);
      let message = "Unknown error";
      if (err instanceof Error) {
        message = err.message;
      } else if (err && typeof err === "object") {
        const o = err as Record<string, unknown>;
        if (typeof o.message === "string") message = o.message;
        else if (Array.isArray(o.errors) && o.errors[0] && typeof (o.errors[0] as Record<string, unknown>).message === "string")
          message = (o.errors[0] as Record<string, string>).message;
        else message = JSON.stringify(o);
      }
      if (__DEV__) {
        console.warn("[Login] Google sign-in error:", message, err);
      }
      const isCancelled =
        typeof message === "string" &&
        (message.toLowerCase().includes("cancel") ||
          message.toLowerCase().includes("cancelled") ||
          message.toLowerCase().includes("user_denied") ||
          message.toLowerCase().includes("err_request_canceled"));
      Alert.alert(
        "Sign in failed",
        isCancelled
          ? "Sign in was cancelled."
          : message && message.length < 120 && message !== "Unknown error"
            ? message
            : "Could not complete Google sign in. Check your connection and that Google is enabled in the Clerk dashboard."
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.gradient}>
        {/* Top bar icon - same as splash */}
        <View style={styles.topBar}>
          <Text style={styles.topIcon}>✦</Text>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Same logo animation as splash: zodiac ring + center logo */}
          <View style={styles.main}>
            <ZodiacLogoRing />

            {/* Typography - same as splash */}
            <View style={styles.typography}>
              <Text style={styles.title}>AstraDaily</Text>
              <Text style={styles.subtitle}>Daily Horoscope generated by AI</Text>
            </View>
          </View>

          {/* Auth section */}
          <View style={styles.authSection}>
            <Text style={styles.welcomeText}>Welcome back</Text>

            <TouchableOpacity
              style={styles.googleButton}
              activeOpacity={0.85}
              disabled={isLoading}
              onPress={handleGoogleLogin}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="logo-google" size={20} color="#FFFFFF" style={styles.googleIcon} />
                  <Text style={styles.googleButtonText}>Continue with Google</Text>
                </>
              )}
            </TouchableOpacity>

            {showContinueButton && (
              <TouchableOpacity
                style={styles.continueButton}
                activeOpacity={0.9}
                onPress={handleContinue}
              >
                <Text style={styles.continueButtonText}>Select sign</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Footer - same as splash */}
          <View style={styles.footer}>
            <Text style={styles.disclaimer}>
              Ai-generated for entertainment only. Not a substitute for professional advice.
            </Text>
            <Text style={styles.copyright}>© 2026 AstraDaily • Cosmic Intelligence</Text>
          </View>
        </ScrollView>

        {/* Decorative - same as splash */}
        <View style={[styles.decor, styles.decor1]}>
          <Text style={styles.decorIcon}>✶</Text>
        </View>
        <View style={[styles.decor, styles.decor2]}>
          <Text style={styles.decorIcon2}>✺</Text>
        </View>
        <View style={[styles.decor, styles.decor3]}>
          <Text style={styles.decorIcon3}>✹</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_DARK,
  },
  gradient: {
    flex: 1,
    backgroundColor: "#0f0a1a",
    alignItems: "center",
    overflow: "hidden",
  },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 16,
    zIndex: 10,
  },
  topIcon: {
    fontSize: 24,
    color: "rgba(127, 19, 236, 0.4)",
  },
  scroll: {
    flex: 1,
    width: "100%",
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 48,
    paddingHorizontal: 24,
    paddingBottom: 32,
    alignItems: "center",
    maxWidth: 400,
    alignSelf: "center",
  },
  main: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  typography: {
    alignItems: "center",
    marginTop: 48,
  },
  title: {
    fontSize: 42,
    fontWeight: "700",
    letterSpacing: -0.5,
    color: "#f1f5f9",
    textAlign: "center",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: 6,
    color: "rgba(127, 19, 236, 0.7)",
    textTransform: "uppercase",
    textAlign: "center",
  },
  authSection: {
    width: "100%",
    alignItems: "center",
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#e2e8f0",
    marginBottom: 20,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 56,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 28,
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  googleIcon: {
    marginRight: 12,
  },
  googleButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  continueButton: {
    width: "100%",
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: PRIMARY,
    borderRadius: 28,
    paddingHorizontal: 24,
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  footer: {
    alignItems: "center",
    paddingHorizontal: 16,
  },
  disclaimer: {
    fontSize: 10,
    color: "rgba(148, 163, 184, 0.6)",
    textAlign: "center",
    marginBottom: 8,
  },
  copyright: {
    fontSize: 12,
    color: "rgba(100, 116, 139, 0.5)",
  },
  decor: {
    position: "absolute",
    pointerEvents: "none",
  },
  decor1: {
    top: 80,
    left: 40,
    opacity: 0.2,
  },
  decor2: {
    top: "33%",
    right: 48,
    opacity: 0.1,
  },
  decor3: {
    bottom: "25%",
    left: 64,
    opacity: 0.15,
  },
  decorIcon: {
    fontSize: 20,
    color: PRIMARY,
  },
  decorIcon2: {
    fontSize: 36,
    color: PRIMARY,
  },
  decorIcon3: {
    fontSize: 24,
    color: PRIMARY,
  },
});
