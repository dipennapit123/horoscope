import React from "react";
import { View, Text, StyleSheet } from "react-native";
import type { Horoscope } from "../types";
import { colors, spacing } from "../theme";

interface Props {
  data: Horoscope;
}

function HoroscopeCardComponent({ data }: Props) {
  return (
    <View style={styles.outer}>
      <View style={styles.glow} />
      <View style={styles.container}>
        <View style={styles.focusBlock}>
          <Text style={styles.eyebrow}>Today&apos;s focus</Text>
          <Text style={styles.title}>{data.title}</Text>
          <Text style={styles.summary}>{data.summary}</Text>
        </View>

        <View style={[styles.sectionCard, styles.sectionWealth]}>
          <View style={styles.sectionHeaderRow}>
            <View style={[styles.iconCircle, styles.iconWealth]}>
              <Text style={styles.iconGlyph}>$</Text>
            </View>
            <Text style={[styles.sectionLabel, styles.sectionWealthLabel]}>
              Wealth
            </Text>
          </View>
          <Text style={styles.sectionText}>{data.wealthText}</Text>
        </View>

        <View style={[styles.sectionCard, styles.sectionLove]}>
          <View style={styles.sectionHeaderRow}>
            <View style={[styles.iconCircle, styles.iconLove]}>
              <Text style={styles.iconGlyph}>♥</Text>
            </View>
            <Text style={[styles.sectionLabel, styles.sectionLoveLabel]}>
              Love
            </Text>
          </View>
          <Text style={styles.sectionText}>{data.loveText}</Text>
        </View>

        <View style={[styles.sectionCard, styles.sectionHealth]}>
          <View style={styles.sectionHeaderRow}>
            <View style={[styles.iconCircle, styles.iconHealth]}>
              <Text style={styles.iconGlyph}>+</Text>
            </View>
            <Text style={[styles.sectionLabel, styles.sectionHealthLabel]}>
              Health
            </Text>
          </View>
          <Text style={styles.sectionText}>{data.healthText}</Text>
        </View>
      </View>
    </View>
  );
}

export const HoroscopeCard = React.memo(HoroscopeCardComponent);

const styles = StyleSheet.create({
  outer: {
    position: "relative",
  },
  glow: {
    position: "absolute",
    inset: 0,
    borderRadius: 28,
    backgroundColor: "rgba(127, 19, 236, 0.16)",
    opacity: 1,
    blurRadius: 40 as any,
  },
  container: {
    backgroundColor: "rgba(10, 6, 24, 0.85)",
    borderRadius: 24,
    padding: spacing(4),
    borderWidth: 1,
    borderColor: "rgba(127, 19, 236, 0.25)",
  },
  focusBlock: {
    alignItems: "center",
    marginBottom: spacing(4),
  },
  eyebrow: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 2,
    color: "rgba(148, 163, 184, 0.9)",
    marginBottom: spacing(1),
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
    marginBottom: spacing(1),
  },
  summary: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: "center",
    marginBottom: spacing(1),
  },
  sectionCard: {
    borderRadius: 20,
    padding: spacing(3),
    backgroundColor: "rgba(10, 6, 24, 0.92)",
    marginBottom: spacing(2),
    borderWidth: 1,
    borderColor: "rgba(127, 19, 236, 0.2)",
    shadowColor: "#7F13EC",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
  },
  sectionWealth: {
    borderColor: "rgba(34,197,94,0.45)",
  },
  sectionLove: {
    borderColor: "rgba(236,72,153,0.45)",
  },
  sectionHealth: {
    borderColor: "rgba(56,189,248,0.45)",
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: spacing(2),
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWealth: {
    backgroundColor: "rgba(34,197,94,0.18)",
  },
  iconLove: {
    backgroundColor: "rgba(236,72,153,0.2)",
  },
  iconHealth: {
    backgroundColor: "rgba(16,185,129,0.2)",
  },
  iconGlyph: {
    fontSize: 18,
    color: colors.text,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: spacing(1),
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  sectionWealthLabel: {
    color: "#4ADE80",
  },
  sectionLoveLabel: {
    color: "#FB7185",
  },
  sectionHealthLabel: {
    color: "#38BDF8",
  },
  sectionText: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
  },
});

