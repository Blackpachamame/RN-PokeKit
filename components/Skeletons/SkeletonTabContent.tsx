import { useThemeColors } from "@/hooks/useThemedStyles";
import { memo, useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

type SkeletonType = "about" | "stats" | "moves";

type Props = {
  type?: SkeletonType;
};

/**
 * SkeletonTabContent - Loading placeholder para el contenido de los tabs
 * Tiene 3 variantes según el tab activo
 */
export const SkeletonTabContent = memo(({ type = "about" }: Props) => {
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

  if (type === "stats") return <SkeletonStats opacity={opacity} skeletonColor={colors.skeleton} />;
  if (type === "moves") return <SkeletonMoves opacity={opacity} skeletonColor={colors.skeleton} />;
  return <SkeletonAbout opacity={opacity} skeletonColor={colors.skeleton} />;
});

// ============================================
// ABOUT TAB SKELETON
// ============================================
function SkeletonAbout({
  opacity,
  skeletonColor,
}: {
  opacity: Animated.AnimatedInterpolation<number>;
  skeletonColor: string;
}) {
  return (
    <View style={styles.aboutContainer}>
      {/* Description skeleton (3 lines) */}
      <View style={styles.descriptionContainer}>
        <Animated.View
          style={[styles.textLine, { width: "100%", opacity, backgroundColor: skeletonColor }]}
        />
        <Animated.View
          style={[styles.textLine, { width: "95%", opacity, backgroundColor: skeletonColor }]}
        />
        <Animated.View
          style={[styles.textLine, { width: "85%", opacity, backgroundColor: skeletonColor }]}
        />
      </View>

      {/* Data cards (Weight/Height) */}
      <View style={styles.dataGrid}>
        <View style={styles.dataRow}>
          <View style={styles.dataCard}>
            <Animated.View style={[styles.dataLabel, { opacity }]} />
            <Animated.View style={[styles.dataValue, { opacity }]} />
          </View>
          <View style={styles.dataCard}>
            <Animated.View style={[styles.dataLabel, { opacity }]} />
            <Animated.View style={[styles.dataValue, { opacity }]} />
          </View>
        </View>
      </View>

      <View style={[styles.separator, { backgroundColor: skeletonColor }]} />

      {/* Category section */}
      <View style={styles.section}>
        <Animated.View style={[styles.sectionTitle, { opacity }]} />
        <Animated.View style={[styles.textLine, { width: "60%", opacity }]} />
      </View>

      <View style={[styles.separator, { backgroundColor: skeletonColor }]} />

      {/* Abilities section */}
      <View style={styles.section}>
        <Animated.View style={[styles.sectionTitle, { opacity }]} />
        <Animated.View style={[styles.textLine, { width: "70%", opacity }]} />
      </View>

      <View style={[styles.separator, { backgroundColor: skeletonColor }]} />

      {/* Weaknesses section */}
      <View style={styles.section}>
        <Animated.View style={[styles.sectionTitle, { opacity }]} />
        <View style={styles.weaknessesContainer}>
          {[100, 90, 95, 85].map((width, index) => (
            <Animated.View key={index} style={[styles.typeBadge, { width, opacity }]} />
          ))}
        </View>
      </View>

      <View style={[styles.separator, { backgroundColor: skeletonColor }]} />

      {/* Evolution section */}
      <View style={styles.section}>
        <Animated.View style={[styles.sectionTitle, { opacity }]} />
        <View style={styles.evolutionContainer}>
          <Animated.View style={[styles.evolutionCard, { opacity }]} />
        </View>
      </View>
    </View>
  );
}

// ============================================
// STATS TAB SKELETON
// ============================================
function SkeletonStats({
  opacity,
  skeletonColor,
}: {
  opacity: Animated.AnimatedInterpolation<number>;
  skeletonColor: string;
}) {
  return (
    <View style={styles.statsContainer}>
      {[1, 2, 3, 4, 5, 6].map((_, index) => (
        <View key={index} style={styles.statRow}>
          {/* Stat name */}
          <Animated.View style={[styles.statName, { opacity, backgroundColor: skeletonColor }]} />
          {/* Stat bar */}
          <Animated.View style={[styles.statBar, { opacity, backgroundColor: skeletonColor }]} />
          {/* Stat value */}
          <Animated.View style={[styles.statValue, { opacity, backgroundColor: skeletonColor }]} />
        </View>
      ))}
    </View>
  );
}

// ============================================
// MOVES TAB SKELETON
// ============================================
function SkeletonMoves({
  opacity,
  skeletonColor,
}: {
  opacity: Animated.AnimatedInterpolation<number>;
  skeletonColor: string;
}) {
  return (
    <View style={styles.movesContainer}>
      {[1, 2, 3, 4, 5].map((_, index) => (
        <Animated.View
          key={index}
          style={[styles.moveCard, { opacity, backgroundColor: skeletonColor }]}
        />
      ))}
    </View>
  );
}

SkeletonTabContent.displayName = "SkeletonTabContent";

const styles = StyleSheet.create({
  // ============================================
  // ABOUT TAB STYLES
  // ============================================
  aboutContainer: {
    paddingTop: 32,
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 24,
  },
  descriptionContainer: {
    marginBottom: 8,
  },
  textLine: {
    height: 16,
    borderRadius: 4,
    marginBottom: 8,
  },
  dataGrid: {
    gap: 12,
  },
  dataRow: {
    flexDirection: "row",
    gap: 12,
  },
  dataCard: {
    flex: 1,
    gap: 8,
  },
  dataLabel: {
    width: 80,
    height: 18,
    borderRadius: 4,
  },
  dataValue: {
    width: 100,
    height: 22,
    borderRadius: 4,
  },
  separator: {
    height: 1,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    width: 120,
    height: 18,
    borderRadius: 4,
  },
  weaknessesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  typeBadge: {
    height: 30,
    borderRadius: 16,
  },
  evolutionContainer: {
    alignItems: "center",
  },
  evolutionCard: {
    width: "100%",
    height: 120,
    borderRadius: 16,
  },

  // ============================================
  // STATS TAB STYLES
  // ============================================
  statsContainer: {
    paddingTop: 32,
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 16,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statName: {
    width: 100,
    height: 16,
    borderRadius: 4,
  },
  statBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
  },
  statValue: {
    width: 40,
    height: 18,
    borderRadius: 4,
  },

  // ============================================
  // MOVES TAB STYLES
  // ============================================
  movesContainer: {
    padding: 20,
    paddingBottom: 32,
    gap: 12,
  },
  moveCard: {
    width: "100%",
    height: 80,
    borderRadius: 12,
  },
});
