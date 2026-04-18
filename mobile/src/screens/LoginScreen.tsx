import React, { useEffect, useState } from "react";
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
import { Ionicons } from "@expo/vector-icons";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import { ZodiacLogoRing } from "../components/ZodiacLogoRing";
import { bootstrapSessionProfile } from "../services/session";
import { LegalDocumentModal } from "../components/LegalDocumentModal";
import { loadTermsConsent, saveTermsConsent } from "../services/consent";
import { publicEnv } from "../config/publicEnv";
import { firebaseAuth } from "../services/firebase";
import { GoogleAuthProvider, onAuthStateChanged, signInWithCredential } from "firebase/auth";

type Props = NativeStackScreenProps<RootStackParamList, "Auth">;

const PRIMARY = "#7f13ec";
const BACKGROUND_DARK = "#191022";

const TERMS_SECTIONS = [
  {
    title: "Acceptance and eligibility",
    bullets: [
      "By using AstraDaily, you agree to these Terms of Service.",
      "You must only use the app in a lawful and respectful way.",
      "If you do not agree, you should not continue into the app.",
    ],
  },
  {
    title: "Entertainment use only",
    bullets: [
      "Horoscope content in AstraDaily is AI-generated for entertainment and general inspiration.",
      "It is not medical, legal, mental health, relationship, or financial advice.",
      "You remain responsible for decisions you make based on app content.",
    ],
  },
  {
    title: "App usage",
    bullets: [
      "Do not misuse, disrupt, or attempt to abuse the app or its services.",
      "Features may change, improve, or become unavailable over time.",
      "We may limit or suspend access if the app is used improperly.",
    ],
  },
  {
    title: "Liability and contact",
    bullets: [
      "The app is provided as-is without guarantees of uninterrupted availability.",
      "We are not responsible for indirect losses caused by reliance on horoscope content.",
      "Questions about these terms can be directed through the app support contact when available.",
    ],
  },
] as const;

const PRIVACY_SECTIONS = [
  {
    title: "Information we collect",
    bullets: [
      "We collect basic account information from Google sign-in, such as your name, email, and profile image.",
      "We store your selected zodiac sign and limited app activity related to horoscope usage.",
      "We may collect technical information needed to keep the app working reliably.",
    ],
  },
  {
    title: "How we use information",
    bullets: [
      "We use your data to sign you in, personalize horoscopes, and support app features.",
      "We use limited analytics and activity information to improve app quality and understand engagement.",
      "We do not state that we sell your personal data.",
    ],
  },
  {
    title: "Third-party services",
    bullets: [
      "Authentication is handled through Firebase Authentication and Google sign-in.",
      "App data may be stored using our hosting, database, and infrastructure providers.",
      "Those providers may process data only as needed to support the service.",
    ],
  },
  {
    title: "Retention and your choices",
    bullets: [
      "We keep data only as long as reasonably needed to operate and improve the app.",
      "Clearing the app or reinstalling it may remove local settings such as consent storage on your device.",
      "More detailed account deletion or support flows can be added later as the product grows.",
    ],
  },
] as const;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const setAuth = useSessionStore((s) => s.setAuth);
  const setZodiacSign = useSessionStore((s) => s.setZodiacSign);
  const termsAccepted = useSessionStore((s) => s.termsAccepted);
  const consentLoaded = useSessionStore((s) => s.consentLoaded);
  const setTermsAccepted = useSessionStore((s) => s.setTermsAccepted);
  const setConsentLoaded = useSessionStore((s) => s.setConsentLoaded);
  const token = useSessionStore((s) => s.token);
  const clerkUserId = useSessionStore((s) => s.clerkUserId);
  const zodiacSign = useSessionStore((s) => s.zodiacSign);

  const [isLoading, setIsLoading] = useState(false);
  const [activeLegalDoc, setActiveLegalDoc] = useState<"terms" | "privacy" | null>(null);
  const [firebaseUser, setFirebaseUser] = useState(() => firebaseAuth.currentUser);
  const webClientId = publicEnv.googleWebClientId();

  const showContinueButton = !!firebaseUser || !!(token && clerkUserId);
  const authDisabled = isLoading || !consentLoaded || !termsAccepted;

  useEffect(() => {
    GoogleSignin.configure({
      webClientId,
      ...(publicEnv.googleIosClientId()
        ? { iosClientId: publicEnv.googleIosClientId() }
        : {}),
      scopes: ["profile", "email"],
      offlineAccess: false,
    });
  }, [webClientId]);

  useEffect(() => {
    const unsub = onAuthStateChanged(firebaseAuth, (user) => {
      setFirebaseUser(user);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (consentLoaded) return;
    let mounted = true;
    void loadTermsConsent().then((accepted) => {
      if (!mounted) return;
      setTermsAccepted(accepted);
      setConsentLoaded(true);
    });
    return () => {
      mounted = false;
    };
  }, [consentLoaded, setConsentLoaded, setTermsAccepted]);

  const toggleConsent = async () => {
    const nextValue = !termsAccepted;
    setTermsAccepted(nextValue);
    await saveTermsConsent(nextValue);
  };

  const handleContinue = async () => {
    if (authDisabled) return;
    if (token && clerkUserId) {
      const route = zodiacSign ? { name: "Main" as const } : { name: "Onboarding" as const };
      navigation.reset({ index: 0, routes: [route] });
      return;
    }

    if (!firebaseUser) return;
    try {
      const jwt = await firebaseUser.getIdToken();
      if (!jwt) return;
      let resolvedZodiacSign = zodiacSign;
      setAuth({ clerkUserId: firebaseUser.uid, token: jwt });
      try {
        const profile = await bootstrapSessionProfile({
          clerkUserId: firebaseUser.uid,
          token: jwt,
          email: firebaseUser.email ?? "",
          fullName: firebaseUser.displayName ?? "",
          avatarUrl: firebaseUser.photoURL ?? undefined,
        });
        resolvedZodiacSign = profile.zodiacSign;
        setZodiacSign(profile.zodiacSign);
      } catch {
        // ignore
      }
      const route = resolvedZodiacSign
        ? { name: "Main" as const }
        : { name: "Onboarding" as const };
      navigation.reset({ index: 0, routes: [route] });
    } catch {
      Alert.alert("Error", "Could not continue. Please try again.");
    }
  };

  const handleGoogleLogin = async () => {
    if (authDisabled) return;
    setIsLoading(true);
    try {
      if (!webClientId) {
        Alert.alert("Configuration error", "Missing Google web client ID.");
        return;
      }

      const hasPlayServices = await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      if (!hasPlayServices) {
        Alert.alert("Google Play Services", "Google Play Services is not available on this device.");
        return;
      }

      const signInResult = await GoogleSignin.signIn();
      if (signInResult.type === "cancelled") {
        return;
      }

      const idToken = signInResult.data.idToken ?? (await GoogleSignin.getTokens()).idToken;
      if (!idToken) throw new Error("Missing Google ID token.");

      const credential = GoogleAuthProvider.credential(idToken);
      const userCred = await signInWithCredential(firebaseAuth, credential);
      const fbUser = userCred.user;
      const jwt = await fbUser.getIdToken();

      setAuth({ clerkUserId: fbUser.uid, token: jwt });

      try {
        const profile = await bootstrapSessionProfile({
          clerkUserId: fbUser.uid,
          token: jwt,
          email: fbUser.email ?? "",
          fullName: fbUser.displayName ?? "",
          avatarUrl: fbUser.photoURL ?? undefined,
        });
        setZodiacSign(profile.zodiacSign);
      } catch {
        // ignore
      }
    } catch (err: unknown) {
      let message = "Could not complete Google sign in. Check Firebase, SHA-1, and Google client IDs.";
      if (err && typeof err === "object" && "code" in err) {
        const code = String((err as { code?: unknown }).code ?? "");
        if (code === statusCodes.SIGN_IN_CANCELLED) {
          return;
        }
        if (code === statusCodes.IN_PROGRESS) {
          message = "Google sign-in is already in progress.";
        } else if (code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          message = "Google Play Services is not available or needs an update.";
        }
      }
      if (err instanceof Error && err.message) {
        if (err.message.includes("RNGoogleSignin") || err.message.includes("Expo Go")) {
          message = "Native Google Sign-In requires an EAS/dev build. It will not work in Expo Go.";
        } else if (err.message.length < 140) {
          message = err.message;
        }
      }
      Alert.alert("Sign in failed", message);
    }
    finally {
      setIsLoading(false);
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

            <View style={styles.consentRow}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => {
                  void toggleConsent();
                }}
                style={styles.checkbox}
              >
                <Ionicons
                  name={termsAccepted ? "checkmark-circle" : "ellipse-outline"}
                  size={22}
                  color={termsAccepted ? PRIMARY : "rgba(148, 163, 184, 0.8)"}
                />
              </TouchableOpacity>
              <Text style={styles.consentText}>
                I agree to the{" "}
                <Text
                  style={styles.consentLink}
                  onPress={() => setActiveLegalDoc("terms")}
                >
                  Terms of Service
                </Text>{" "}
                and{" "}
                <Text
                  style={styles.consentLink}
                  onPress={() => setActiveLegalDoc("privacy")}
                >
                  Privacy Policy
                </Text>
                .
              </Text>
            </View>

            {!termsAccepted && consentLoaded && (
              <Text style={styles.consentHint}>
                Please accept the Terms of Service and Privacy Policy to continue.
              </Text>
            )}

            <TouchableOpacity
              style={[styles.authButtonBase, styles.googleButton]}
              activeOpacity={0.85}
              disabled={authDisabled}
              onPress={handleGoogleLogin}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <View style={styles.googleIconWrap}>
                    <Ionicons name="logo-google" size={20} color="#FFFFFF" style={styles.googleIcon} />
                  </View>
                  <Text style={styles.googleButtonText}>Continue with Google</Text>
                </>
              )}
            </TouchableOpacity>

            {showContinueButton && (
              <TouchableOpacity
                style={[styles.authButtonBase, styles.continueButton]}
                activeOpacity={0.9}
                disabled={authDisabled}
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

      <LegalDocumentModal
        visible={activeLegalDoc === "terms"}
        title="Terms of Service"
        intro="These Terms explain how AstraDaily should be used and what users can expect from the app."
        sections={TERMS_SECTIONS.map((section) => ({
          title: section.title,
          bullets: [...section.bullets],
        }))}
        onClose={() => setActiveLegalDoc(null)}
      />
      <LegalDocumentModal
        visible={activeLegalDoc === "privacy"}
        title="Privacy Policy"
        intro="This Privacy Policy explains what information AstraDaily uses and how it supports the app experience."
        sections={PRIVACY_SECTIONS.map((section) => ({
          title: section.title,
          bullets: [...section.bullets],
        }))}
        onClose={() => setActiveLegalDoc(null)}
      />
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
  consentRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
    gap: 10,
  },
  checkbox: {
    paddingTop: 1,
  },
  consentText: {
    flex: 1,
    color: "#CBD5E1",
    fontSize: 13,
    lineHeight: 20,
  },
  consentLink: {
    color: "#C084FC",
    fontWeight: "700",
    textDecorationLine: "underline",
  },
  consentHint: {
    width: "82%",
    alignSelf: "center",
    marginBottom: 12,
    color: "rgba(248, 113, 113, 0.95)",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },
  authButtonBase: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 56,
    borderRadius: 28,
    paddingHorizontal: 24,
    alignSelf: "stretch",
    position: "relative",
  },
  googleButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    marginBottom: 12,
  },
  googleIconWrap: {
    position: "absolute",
    left: 24,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  googleIcon: {
  },
  googleButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    width: "100%",
  },
  continueButton: {
    backgroundColor: PRIMARY,
    borderWidth: 1,
    borderColor: "transparent",
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    width: "100%",
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
