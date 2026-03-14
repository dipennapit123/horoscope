import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  InteractionManager,
} from "react-native";
import dayjs from "dayjs";
import { api } from "../services/api";
import { recordActivity } from "../services/activity";
import { useSessionStore } from "../store/useSessionStore";
import type { Horoscope } from "../types";
import { HoroscopeCard } from "../components/HoroscopeCard";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../AppNavigator";
import { Ionicons } from "@expo/vector-icons";

type DayMode = "yesterday" | "today" | "tomorrow";

export const HoroscopeScreen: React.FC = () => {
  const userId = useSessionStore((s) => s.clerkUserId);
  const zodiacSign = useSessionStore((s) => s.zodiacSign);
  const defaultDayMode = useSessionStore((s) => s.defaultDayMode);
  const setDefaultDayMode = useSessionStore((s) => s.setDefaultDayMode);
  const cachedHistory = useSessionStore((s) => s.history);
  const setHistoryStore = useSessionStore((s) => s.setHistory);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(cachedHistory.length === 0);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<Horoscope[]>(cachedHistory);
  const [dayMode, setDayMode] = useState<DayMode>(defaultDayMode);
  const horoscopeViewRecorded = useRef(false);
  const loadInFlight = useRef(false);

  const loadHistory = useCallback(async () => {
    if (!userId || loadInFlight.current) return;
    loadInFlight.current = true;
    const hasCache = useSessionStore.getState().history.length > 0;
    setLoading(!hasCache);
    setError(null);
    try {
      const res = await api.get<{ success: boolean; data: Horoscope[] }>(
        "/horoscopes/history",
        {
          headers: { "x-clerk-user-id": userId },
        },
      );
      const data = res.data.data ?? [];
      setHistory(data);
      setHistoryStore(data);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: { message?: string } } } })
          ?.response?.data?.error?.message ?? "Failed to load horoscope.";
      setError(msg);
    } finally {
      setLoading(false);
      loadInFlight.current = false;
    }
  }, [userId, setHistoryStore]);

  useEffect(() => {
    void loadHistory();
  }, [userId, loadHistory]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  }, [loadHistory]);

  const activeHoroscope = useMemo(() => {
    if (history.length === 0) return null;
    const base = dayjs().startOf("day");
    const offset =
      dayMode === "yesterday" ? -1 : dayMode === "tomorrow" ? 1 : 0;
    const target = base.add(offset, "day");
    const exact = history.find((h) =>
      dayjs(h.date).isSame(target, "day"),
    );
    return exact ?? history[0];
  }, [history, dayMode]);

  const activeDate = useMemo(() => {
    const base = dayjs();
    const offset =
      dayMode === "yesterday" ? -1 : dayMode === "tomorrow" ? 1 : 0;
    return base.add(offset, "day");
  }, [dayMode]);

  useEffect(() => {
    if (!userId || !activeHoroscope || horoscopeViewRecorded.current) return;
    horoscopeViewRecorded.current = true;
    InteractionManager.runAfterInteractions(() => {
      recordActivity(userId, "HOROSCOPE_VIEW");
    });
  }, [userId, activeHoroscope]);

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{
        paddingHorizontal: 24,
        paddingTop: 32,
        paddingBottom: 32,
        gap: 16,
      }}
      refreshControl={
        <RefreshControl
          tintColor="#A855F7"
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }>
      {/* Header row: back, center icon + sign */}
      <View className="flex-row items-center justify-between mb-4">
        <TouchableOpacity
          className="h-12 w-12 rounded-full items-center justify-center bg-primary/20"
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.replace("Onboarding");
            }
          }}
        >
          <Ionicons name="arrow-back" size={22} color="#F9FAFB" />
        </TouchableOpacity>

        <View className="flex-1 items-center">
          <View className="w-10 h-10 rounded-full bg-primary/15 items-center justify-center mb-1">
            <Ionicons name="sparkles-outline" size={22} color="#7F13EC" />
          </View>
          <Text className="text-2xl font-funky-bold tracking-tight text-text">
            {zodiacSign ?? "Your sign"}
          </Text>
        </View>
      </View>

      <Text className="text-xs font-medium uppercase tracking-[3px] text-textMuted mb-2 text-center">
        {activeDate.format("dddd, MMM D, YYYY")}
      </Text>

      <View className="flex-row justify-center gap-2 mb-8">
        {(["yesterday", "today", "tomorrow"] as DayMode[]).map((mode) => (
          <TouchableOpacity
            key={mode}
            className={`px-3 py-1 rounded-full ${
              dayMode === mode ? "bg-primary" : "bg-surfaceMuted"
            }`}
            onPress={() => {
              setDayMode(mode);
              setDefaultDayMode(mode);
            }}
          >
              <Text
                className={`text-xs font-funky-semibold ${
                  dayMode === mode ? "text-text" : "text-textMuted"
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

      {loading && <View className="h-56 rounded-3xl bg-surfaceMuted" />}

      {error && !loading && (
        <Text className="text-xs text-red-300">{error}</Text>
      )}

      {!loading && !error && activeHoroscope && (
        <HoroscopeCard data={activeHoroscope} />
      )}

      {!loading && !error && !activeHoroscope && (
        <Text className="text-xs text-textMuted">
          No horoscope has been published for your sign yet. Check back later.
        </Text>
      )}

      {/* AI disclaimer for users and store review */}
      <View className="mt-6 mb-4 px-4">
        <Text
          className="text-[10px] text-textMuted/70 text-center"
          style={{ textAlign: "center" }}
        >
          Ai-generated for entertainment only. Not a substitute for professional advice.
        </Text>
      </View>
    </ScrollView>
  );
};
