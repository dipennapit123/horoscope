import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator } from "react-native";
import { useSessionStore } from "../store/useSessionStore";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../AppNavigator";
import { Ionicons } from "@expo/vector-icons";
import { useToast } from "../context/ToastContext";
import { recordActivity } from "../services/activity";
import { firebaseAuth } from "../services/firebase";
import { clearGoogleSignInSession } from "../services/google-signin-session";
import { onAuthStateChanged, signOut } from "firebase/auth";

type Props = NativeStackScreenProps<RootStackParamList, "Main">;

export const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const toast = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState(() => firebaseAuth.currentUser);
  const clerkUserId = useSessionStore((s) => s.clerkUserId);
  const logout = useSessionStore((s) => s.logout);
  const setZodiacSign = useSessionStore((s) => s.setZodiacSign);
  const theme = useSessionStore((s) => s.theme);
  const setTheme = useSessionStore((s) => s.setTheme);
  const defaultDayMode = useSessionStore((s) => s.defaultDayMode);
  const setDefaultDayMode = useSessionStore((s) => s.setDefaultDayMode);

  useEffect(() => {
    if (clerkUserId) recordActivity(clerkUserId, "SETTINGS_VIEW");
  }, [clerkUserId]);

  useEffect(() => {
    const unsub = onAuthStateChanged(firebaseAuth, (user) => {
      setFirebaseUser(user);
    });
    return unsub;
  }, []);

  const handleChangeSign = () => {
    setZodiacSign(null as any);
    navigation.replace("Onboarding");
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingBottom: 32,
        }}
      >
        {/* header */}
        <View className="flex-row items-center justify-between px-6 pt-8 pb-4">
          <TouchableOpacity
            className="h-10 w-10 rounded-full items-center justify-center bg-white/5 border border-white/10"
            onPress={() => {
              if (navigation.canGoBack()) {
                navigation.goBack();
              }
            }}
          >
            <Ionicons name="arrow-back" size={20} color="#F9FAFB" />
          </TouchableOpacity>
          <Text className="text-xl font-funky-bold text-text tracking-tight">
            Settings
          </Text>
          <View className="h-10 w-10" />
        </View>

        <View className="px-6 pb-4">
        {/* profile */}
        <View className="items-center gap-4 mb-8">
          <View className="relative">
            <View className="h-24 w-24 rounded-full border-2 border-primary/50 p-1 bg-primary/20 items-center justify-center overflow-hidden">
              {firebaseUser?.photoURL ? (
                <Image
                  source={{ uri: firebaseUser.photoURL }}
                  className="w-full h-full rounded-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="flex-1 w-full h-full rounded-full bg-[#1f1433] items-center justify-center">
                  <Ionicons name="person" size={40} color="#F9FAFB" />
                </View>
              )}
            </View>
            <View className="absolute bottom-0 right-0 bg-primary rounded-full p-1.5 border-2 border-background">
              <Ionicons name="create" size={14} color="#FFFFFF" />
            </View>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-funky-bold text-text leading-tight" numberOfLines={1}>
              {firebaseUser?.displayName?.trim() || firebaseUser?.email || "Astro Explorer"}
            </Text>
            <Text className="text-sm text-textMuted">
              {firebaseUser?.email || "Your cosmic profile"}
            </Text>
          </View>
        </View>

        {/* Personalization section */}
        <View className="space-y-3 mb-6">
          <Text className="text-xs font-bold uppercase tracking-[3px] text-primary ml-1">
            Personalization
          </Text>

          {/* Zodiac sign row */}
          <TouchableOpacity
            className="glass flex-row items-center justify-between rounded-xl px-4 py-3 bg-white/5 border border-white/10"
            activeOpacity={0.9}
            onPress={handleChangeSign}
          >
            <View className="flex-row items-center gap-4">
              <View className="h-10 w-10 rounded-lg bg-primary/20 items-center justify-center">
                <Ionicons name="sparkles-outline" size={20} color="#7F13EC" />
              </View>
              <View>
                <Text className="text-base font-semibold text-text">
                  Zodiac sign
                </Text>
                <Text className="text-xs text-textMuted">
                  Update your star identity
                </Text>
              </View>
            </View>
            <View className="flex-row items-center gap-1">
              <Text className="text-sm text-primary">Change</Text>
              <Ionicons name="chevron-forward" size={16} color="#64748B" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Preferences section */}
        <View className="space-y-3 mb-8">
          <Text className="text-xs font-bold uppercase tracking-[3px] text-primary ml-1">
            Preferences
          </Text>

          {/* Appearance */}
          <View className="glass flex-row items-center justify-between rounded-xl px-4 py-3 bg-white/5 border border-white/10">
            <View className="flex-row items-center gap-4">
              <View className="h-10 w-10 rounded-lg bg-primary/20 items-center justify-center">
                <Ionicons name="moon-outline" size={20} color="#7F13EC" />
              </View>
              <View>
                <Text className="text-base font-semibold text-text">
                  Appearance
                </Text>
                <Text className="text-xs text-textMuted">
                  {theme === "dark" ? "Dark mode active" : "Match system theme"}
                </Text>
              </View>
            </View>
            <View className="flex-row gap-2">
              {(["dark", "system"] as const).map((mode) => (
                <TouchableOpacity
                  key={mode}
                  className={`px-3 py-1 rounded-full ${
                    theme === mode ? "bg-primary" : "bg-surfaceMuted"
                  }`}
                  onPress={() => setTheme(mode)}
                >
                  <Text
                    className={`text-xs ${
                      theme === mode
                        ? "text-text font-semibold"
                        : "text-textMuted"
                    }`}
                  >
                    {mode === "dark" ? "Dark" : "System"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Default day */}
          <View className="glass rounded-xl px-4 py-3 bg-white/5 border border-white/10">
            <View className="flex-row items-center gap-4 mb-2">
              <View className="h-10 w-10 rounded-lg bg-primary/20 items-center justify-center">
                <Ionicons name="calendar-outline" size={20} color="#7F13EC" />
              </View>
              <View>
                <Text className="text-base font-semibold text-text">
                  Default day on open
                </Text>
                <Text className="text-xs text-textMuted">
                  Choose which day loads first
                </Text>
              </View>
            </View>
            <View className="flex-row gap-2 mt-1">
              {(["yesterday", "today", "tomorrow"] as const).map((mode) => (
                <TouchableOpacity
                  key={mode}
                  className={`px-3 py-1 rounded-full ${
                    defaultDayMode === mode ? "bg-primary" : "bg-surfaceMuted"
                  }`}
                  onPress={() => setDefaultDayMode(mode)}
                >
                  <Text
                    className={`text-xs ${
                      defaultDayMode === mode
                        ? "text-text font-semibold"
                        : "text-textMuted"
                    }`}
                  >
                    {mode === "yesterday"
                      ? "Yesterday"
                      : mode === "today"
                      ? "Today"
                      : "Tomorrow"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={{
            width: "100%",
            marginTop: 24,
            marginBottom: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 14,
            paddingHorizontal: 16,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "rgba(239, 68, 68, 0.3)",
            backgroundColor: "rgba(239, 68, 68, 0.1)",
          }}
          activeOpacity={0.9}
          disabled={isLoggingOut}
          onPress={async () => {
            setIsLoggingOut(true);
            try {
              await signOut(firebaseAuth);
            } catch {
              // continue to clear app state
            }
            // Native Google session must be cleared or the next sign-in reuses the same account.
            await clearGoogleSignInSession();
            logout();
            toast.show("You have been logged out.");
            setTimeout(() => {
              navigation.replace("Auth");
            }, 400);
          }}
        >
          {isLoggingOut ? (
            <ActivityIndicator size="small" color="#FCA5A5" />
          ) : (
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
              <Ionicons name="log-out-outline" size={18} color="#FCA5A5" style={{ marginRight: 8 }} />
              <Text style={{ color: "#FCA5A5", fontWeight: "600" }}>Log out</Text>
            </View>
          )}
        </TouchableOpacity>

          <Text className="text-center text-[10px] uppercase tracking-[3px] text-slate-600 mb-4">
            AstraDaily Version 1.0.0
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

