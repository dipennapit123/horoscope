import React, { useCallback, useRef, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Platform, StyleSheet, Alert, ActivityIndicator } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../AppNavigator";
import type { Horoscope, ZodiacSign } from "../types";
import { useSessionStore } from "../store/useSessionStore";
import { api } from "../services/api";
import { refreshAndStoreFirebaseIdToken } from "../services/auth-token";
import { recordActivity } from "../services/activity";
import { Ionicons } from "@expo/vector-icons";

type Props = NativeStackScreenProps<RootStackParamList, "Onboarding">;
const DOUBLE_PRESS_MS = 400;

const zodiacSigns: { id: ZodiacSign; label: string; icon: string }[] = [
  { id: "ARIES", label: "Aries", icon: "♈" },
  { id: "TAURUS", label: "Taurus", icon: "♉" },
  { id: "GEMINI", label: "Gemini", icon: "♊" },
  { id: "CANCER", label: "Cancer", icon: "♋" },
  { id: "LEO", label: "Leo", icon: "♌" },
  { id: "VIRGO", label: "Virgo", icon: "♍" },
  { id: "LIBRA", label: "Libra", icon: "♎" },
  { id: "SCORPIO", label: "Scorpio", icon: "♏" },
  { id: "SAGITTARIUS", label: "Sagittarius", icon: "♐" },
  { id: "CAPRICORN", label: "Capricorn", icon: "♑" },
  { id: "AQUARIUS", label: "Aquarius", icon: "♒" },
  { id: "PISCES", label: "Pisces", icon: "♓" },
];

const personalityBySign: Record<ZodiacSign, string> = {
  ARIES: "Bold, energetic, and pioneering.",
  TAURUS: "Grounded, patient, and dependable.",
  GEMINI: "Curious, witty, and adaptable.",
  CANCER: "Nurturing, intuitive, and protective.",
  LEO: "Radiant, confident, and loving.",
  VIRGO: "Practical, thoughtful, and precise.",
  LIBRA: "Charming, fair, and relationship-focused.",
  SCORPIO: "Intense, magnetic, and transformative.",
  SAGITTARIUS: "Adventurous, optimistic, and wise.",
  CAPRICORN: "Ambitious, resilient, and strategic.",
  AQUARIUS: "Original, visionary, and independent.",
  PISCES: "Empathic, dreamy, and deeply intuitive.",
};

const styles = StyleSheet.create({
  gridContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 120,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  zodiacCard: {
    width: "31%",
    marginRight: "3.5%",
    marginBottom: 16,
    aspectRatio: 1,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: "rgba(127, 19, 236, 0.4)",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 20,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  zodiacCardLastInRow: {
    marginRight: 0,
  },
  zodiacCardActive: {
    backgroundColor: "rgba(124, 58, 237, 0.2)",
    borderColor: "#7C3AED",
    transform: [{ scale: 1.05 }],
    ...Platform.select({
      ios: {
        shadowColor: "#7F13EC",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  zodiacCardInactive: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  zodiacIcon: {
    fontSize: 28,
    color: "#7C3AED",
    marginBottom: 4,
  },
  zodiacLabel: {
    fontSize: 12,
    color: "#E2E8F0",
  },
  zodiacLabelActive: {
    color: "#F9FAFB",
    fontWeight: "600",
  },
  checkBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#7C3AED",
    borderRadius: 12,
    padding: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  continueButton: {
    width: "100%",
    height: 56,
    borderRadius: 28,
    backgroundColor: "#7C3AED",
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#7F13EC",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  disclaimer: {
    fontSize: 10,
    color: "rgba(148, 163, 184, 0.7)",
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 16,
  },
});

type ZodiacItem = { id: ZodiacSign; label: string; icon: string };

const ZodiacCard = React.memo(function ZodiacCard({
  item,
  isActive,
  isThirdInRow,
  onPress,
}: {
  item: ZodiacItem;
  isActive: boolean;
  isThirdInRow: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[
        styles.zodiacCard,
        isThirdInRow && styles.zodiacCardLastInRow,
        isActive ? styles.zodiacCardActive : styles.zodiacCardInactive,
      ]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Text style={styles.zodiacIcon}>{item.icon}</Text>
      <Text
        style={[styles.zodiacLabel, isActive && styles.zodiacLabelActive]}
        numberOfLines={1}
      >
        {item.label}
      </Text>
      {isActive && (
        <View style={styles.checkBadge}>
          <Ionicons name="checkmark" size={14} color="#FFFFFF" />
        </View>
      )}
    </TouchableOpacity>
  );
});

export const ZodiacSelectionScreen: React.FC<Props> = ({ navigation, route }) => {
  const userId = useSessionStore((s) => s.clerkUserId);
  const storedZodiac = useSessionStore((s) => s.zodiacSign);
  const setZodiacSign = useSessionStore((s) => s.setZodiacSign);
  const setHistory = useSessionStore((s) => s.setHistory);
  const [selected, setSelected] = React.useState<ZodiacSign | null>(
    storedZodiac ?? null,
  );
  const [saving, setSaving] = useState(false);
  const lastTappedSign = useRef<ZodiacSign | null>(null);
  const lastTappedTime = useRef<number>(0);

  const saveSignAndNavigate = useCallback(
    async (sign: ZodiacSign, openHoroscopeTab?: boolean) => {
      if (userId) {
        setSaving(true);
        try {
          const fresh = await refreshAndStoreFirebaseIdToken();
          if (!fresh) {
            setSaving(false);
            Alert.alert("Session expired", "Please sign in again.");
            return;
          }
          await api.patch(
            "/users/zodiac",
            { zodiacSign: sign },
            { headers: { "x-clerk-user-id": userId } },
          );
          recordActivity(userId, "ZODIAC_SELECTED");
        } catch (err: unknown) {
          const msg =
            (err as { response?: { data?: { error?: { message?: string } } } })
              ?.response?.data?.error?.message ?? "Could not save your sign.";
          setSaving(false);
          Alert.alert("Could not save sign", msg + " Please try again.");
          return;
        }
        setSaving(false);
      }
      setZodiacSign(sign);
      setHistory([], sign);
      if (userId) {
        void api
          .get<{ success: boolean; data: Horoscope[] }>("/horoscopes/history", {
            headers: { "x-clerk-user-id": userId },
          })
          .then((res) => {
            setHistory(res.data.data ?? [], sign);
          })
          .catch(() => {
            // Ignore prefetch failures; Horoscope screen will fetch normally.
          });
      }
      const isOnboarding = route.name === "Onboarding";
      if (isOnboarding) {
        // Always open Horoscope tab so user sees their forecast immediately
        navigation.replace("Main", { screen: "Horoscope" as const });
      } else {
        (navigation as { navigate: (name: string) => void }).navigate("Horoscope");
      }
    },
    [userId, route.name, navigation, setHistory, setZodiacSign]
  );

  const handleContinue = useCallback(async () => {
    if (!selected) return;
    await saveSignAndNavigate(selected, false);
  }, [selected, saveSignAndNavigate]);

  const handleZodiacPress = useCallback(
    (item: ZodiacItem) => {
      const now = Date.now();
      const isDoublePress =
        lastTappedSign.current === item.id && now - lastTappedTime.current <= DOUBLE_PRESS_MS;
      lastTappedSign.current = item.id;
      lastTappedTime.current = now;

      if (isDoublePress) {
        setSelected(item.id);
        saveSignAndNavigate(item.id, true);
        return;
      }
      setSelected(item.id);
    },
    [saveSignAndNavigate]
  );

  return (
    <View className="flex-1 bg-background">
      {/* Gradient-like main wrapper */}
      <View className="relative flex-1 w-full max-w-md mx-auto bg-background">
        {/* Top nav */}
        <View className="flex-row items-center justify-between px-4 pt-6 pb-2">
          {/* left spacer to keep title centered */}
          <View className="h-12 w-12" />
          <Text className="flex-1 text-center pr-12 text-lg font-funky-bold text-text tracking-tight">
            Select sign
          </Text>
          {/* right action button (same behavior as bottom CTA) */}
          <TouchableOpacity
            className={`h-12 w-12 rounded-full items-center justify-center bg-primary/20 ${
              !selected || saving ? "opacity-40" : ""
            }`}
            onPress={handleContinue}
            disabled={!selected || saving}
            activeOpacity={0.9}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#F9FAFB" />
            ) : (
              <Ionicons name="arrow-forward" size={22} color="#F9FAFB" />
            )}
          </TouchableOpacity>
        </View>

        {/* Progress bar */}
        <View className="px-6 py-2">
          <View className="w-full h-1 rounded-full bg-primary/20 overflow-hidden">
            <View className="h-full w-1/3 bg-primary" />
          </View>
        </View>

        {/* Zodiac grid - memoized cards for efficient re-renders */}
        <ScrollView
          contentContainerStyle={styles.gridContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.grid}>
            {zodiacSigns.map((item, index) => (
              <ZodiacCard
                key={item.id}
                item={item}
                isActive={selected === item.id}
                isThirdInRow={(index + 1) % 3 === 0}
                onPress={() => handleZodiacPress(item)}
              />
            ))}
          </View>
        </ScrollView>

        {/* Footer card + button */}
        <View className="px-6 pb-8 space-y-4 bg-background">
          <View className="rounded-xl bg-surface border border-white/5 px-4 py-3 flex-row items-center gap-3">
            <View className="w-10 h-10 rounded-full bg-primary/20 items-center justify-center">
              <Ionicons name="sparkles-outline" size={20} color="#7F13EC" />
            </View>
            <View className="flex-1">
              <Text className="text-[11px] text-slate-400">Selected personality</Text>
              <Text className="text-xs font-funky-semibold text-text">
                {selected
                  ? `${zodiacSigns.find((z) => z.id === selected)?.label}: ${
                      personalityBySign[selected]
                    }`
                  : "Choose a sign to see a quick personality snapshot."}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.continueButton, (!selected || saving) && styles.continueButtonDisabled]}
            disabled={!selected || saving}
            onPress={handleContinue}
            activeOpacity={0.9}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.continueButtonText}>
                Continue to your forecast
              </Text>
            )}
          </TouchableOpacity>

          <Text className="text-center text-[11px] text-slate-500 pb-2">
            By continuing, you agree to our Terms of Service.
          </Text>
          <Text
            style={[styles.disclaimer]}
          >
            Ai-generated for entertainment only. Not a substitute for professional advice.
          </Text>
        </View>

        {/* Decorative glow removed near arrow to avoid overlap */}
      </View>
    </View>
  );
};
