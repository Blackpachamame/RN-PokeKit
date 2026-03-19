import { useThemeColors } from "@/hooks/useThemedStyles";
import { ThemeColors } from "@/utils/themes";
import { useEffect, useMemo, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

type Props = {
  value: number;
  maxValue: number;
  color?: string;
};

export function StatBar({ value, maxValue, color = "#4CAF50" }: Props) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const animatedValue = useRef(new Animated.Value(0)).current;
  const percentage = Math.min(value / maxValue, 1);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: percentage,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [percentage]);

  const widthInterpolated = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.barBackground}>
      <Animated.View
        style={[styles.barFill, { width: widthInterpolated, backgroundColor: color }]}
      />
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    barBackground: {
      flex: 1,
      height: 8,
      backgroundColor: colors.backgroundTertiary,
      borderRadius: 999,
      overflow: "hidden",
    },
    barFill: {
      height: "100%",
      borderRadius: 999,
    },
  });
