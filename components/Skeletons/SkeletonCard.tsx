import { useThemeColors } from "@/hooks/useThemedStyles";
import { LinearGradient } from "expo-linear-gradient";
import { memo, useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

export const SkeletonCard = memo(() => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const colors = useThemeColors();

  useEffect(() => {
    const shimmer = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
    );

    shimmer.start();
    return () => shimmer.stop();
  }, [shimmerAnim]);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <LinearGradient
      style={[styles.card, { backgroundColor: colors.card }]}
      colors={[colors.skeleton, colors.backgroundSecondary, colors.skeleton]}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}>
      <View style={styles.textContainer}>
        {/* Número + corazón */}
        <View style={styles.metaRow}>
          <Animated.View
            style={[styles.numberSkeleton, { opacity, backgroundColor: colors.skeleton }]}
          />
          <Animated.View
            style={[styles.heartSkeleton, { opacity, backgroundColor: colors.skeleton }]}
          />
        </View>

        {/* Nombre */}
        <Animated.View
          style={[styles.nameSkeleton, { opacity, backgroundColor: colors.skeleton }]}
        />

        {/* Tipos */}
        <View style={styles.typesContainer}>
          <Animated.View
            style={[styles.typeBadge, { opacity, backgroundColor: colors.skeleton }]}
          />
          <Animated.View
            style={[styles.typeBadge, { opacity, width: 60, backgroundColor: colors.skeleton }]}
          />
        </View>
      </View>

      {/* Imagen */}
      <Animated.View
        style={[styles.imageSkeleton, { opacity, backgroundColor: colors.skeleton }]}
      />
    </LinearGradient>
  );
});

SkeletonCard.displayName = "SkeletonCard";

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  textContainer: {
    flex: 1,
    gap: 4,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  numberSkeleton: {
    width: 48,
    height: 12,
    borderRadius: 4,
  },
  heartSkeleton: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  nameSkeleton: {
    width: 130,
    height: 20,
    borderRadius: 4,
    marginTop: 2,
  },
  typesContainer: {
    flexDirection: "row",
    gap: 6,
    marginTop: 4,
  },
  typeBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  imageSkeleton: {
    width: 90,
    height: 90,
    borderRadius: 45,
    flexShrink: 0,
  },
});
