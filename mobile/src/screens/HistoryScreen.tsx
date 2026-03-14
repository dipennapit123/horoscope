import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import dayjs from "dayjs";
import { colors, spacing } from "../theme";
import { api } from "../services/api";
import { useSessionStore } from "../store/useSessionStore";
import type { Horoscope } from "../types";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../AppNavigator";

export const HistoryScreen: React.FC = () => {
  const userId = useSessionStore((s) => s.clerkUserId);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [items, setItems] = useState<Horoscope[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const res = await api.get<{ success: boolean; data: Horoscope[] }>(
          "/horoscopes/history",
          { headers: { "x-clerk-user-id": userId } },
        );
        setItems(res.data.data);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [userId]);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            }
          }}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerTextBlock}>
          <Text style={styles.title}>History</Text>
          <Text style={styles.subtitle}>
            Swipe back through previous alignments for your sign.
          </Text>
        </View>
      </View>
      {loading ? (
        <View style={styles.skeleton} />
      ) : items.length === 0 ? (
        <Text style={styles.empty}>
          No previous horoscopes yet. Once daily forecasts are published, they
          will appear here.
        </Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingVertical: spacing(3), gap: spacing(2) }}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View>
                <Text style={styles.rowDate}>
                  {dayjs(item.date).format("MMM D, YYYY")}
                </Text>
                <Text style={styles.rowTitle}>{item.title}</Text>
                <Text
                  style={styles.rowSummary}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {item.summary}
                </Text>
              </View>
              <View style={styles.pill}>
                <Text style={styles.pillText}>View</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing(4),
    paddingTop: spacing(8),
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing(3),
    gap: spacing(2),
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: {
    fontSize: 18,
    color: colors.text,
  },
  headerTextBlock: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
  },
  subtitle: {
    marginTop: spacing(1),
    fontSize: 13,
    color: colors.textMuted,
  },
  skeleton: {
    marginTop: spacing(4),
    height: 150,
    borderRadius: 24,
    backgroundColor: colors.surfaceMuted,
  },
  empty: {
    marginTop: spacing(4),
    fontSize: 13,
    color: colors.textMuted,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing(3),
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  rowDate: {
    fontSize: 12,
    color: colors.textMuted,
  },
  rowTitle: {
    fontSize: 14,
    color: colors.text,
    marginTop: spacing(1),
  },
  rowSummary: {
    marginTop: spacing(0.5),
    fontSize: 12,
    color: colors.textMuted,
  },
  pill: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(1),
    borderRadius: 999,
    backgroundColor: "rgba(129,140,248,0.2)",
  },
  pillText: {
    fontSize: 11,
    color: colors.text,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});

