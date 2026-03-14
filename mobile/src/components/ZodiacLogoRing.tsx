import React, { useEffect, useRef } from "react";
import { View, Text, Animated, Easing, StyleSheet, useWindowDimensions } from "react-native";

const PRIMARY = "#7f13ec";
const ZODIAC_SYMBOLS = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];

function getZodiacPositions(radius: number, center: number) {
  return ZODIAC_SYMBOLS.map((_, i) => {
    const angleDeg = i * 30;
    const angleRad = (angleDeg * Math.PI) / 180;
    const x = center + radius * Math.sin(angleRad);
    const y = center - radius * Math.cos(angleRad);
    return { symbol: ZODIAC_SYMBOLS[i], x, y };
  });
}

type Props = {
  /** Max size in px; default from screen width */
  size?: number;
};

export const ZodiacLogoRing: React.FC<Props> = ({ size: sizeProp }) => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const { width } = useWindowDimensions();

  useEffect(() => {
    const anim = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 60000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    anim.start();
    return () => anim.stop();
  }, [spinValue]);

  const ringRotate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  const iconRotate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "-360deg"],
  });

  const ringSize = sizeProp ?? Math.min(width - 48, 320);
  const center = ringSize / 2;
  const radius = center - 20;
  const iconSize = ringSize > 240 ? 28 : 22;
  const positions = getZodiacPositions(radius - 8, center);
  const centerLogoSize = ringSize > 240 ? 192 : 120;
  const centerIconSize = ringSize > 240 ? 72 : 48;

  return (
    <View style={[styles.ringContainer, { width: ringSize, height: ringSize }]}>
      <View
        style={[
          styles.glow,
          {
            width: ringSize + 40,
            height: ringSize + 40,
            borderRadius: (ringSize + 40) / 2,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.ring,
          {
            width: ringSize,
            height: ringSize,
            borderRadius: ringSize / 2,
            transform: [{ rotate: ringRotate }],
          },
        ]}
      >
        {positions.map((pos, i) => (
          <Animated.View
            key={i}
            style={[
              styles.zodiacIconWrap,
              {
                left: pos.x - iconSize / 2,
                top: pos.y - iconSize / 2,
                width: iconSize,
                height: iconSize,
                transform: [{ rotate: iconRotate }],
              },
            ]}
          >
            <Text style={[styles.zodiacIcon, { fontSize: iconSize - 2 }]}>{pos.symbol}</Text>
          </Animated.View>
        ))}
      </Animated.View>
      <View style={[styles.centerLogo, { width: centerLogoSize, height: centerLogoSize, borderRadius: centerLogoSize / 2 }]}>
        <Text style={[styles.centerIcon, { fontSize: centerIconSize }]}>☾</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  ringContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  glow: {
    position: "absolute",
    backgroundColor: "rgba(127, 19, 236, 0.2)",
    opacity: 0.9,
  },
  ring: {
    position: "absolute",
    borderWidth: 1,
    borderColor: "rgba(127, 19, 236, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  zodiacIconWrap: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  zodiacIcon: {
    color: PRIMARY,
    textShadowColor: "rgba(127, 19, 236, 0.8)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  centerLogo: {
    backgroundColor: "rgba(127, 19, 236, 0.35)",
    borderWidth: 1,
    borderColor: "rgba(127, 19, 236, 0.3)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  centerIcon: {
    color: "#FFFFFF",
    textShadowColor: "rgba(127, 19, 236, 0.9)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
});
