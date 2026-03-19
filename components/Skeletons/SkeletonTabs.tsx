import { useThemeColors } from "@/hooks/useThemedStyles";
import { memo, useEffect, useRef } from "react";
import { Animated, Platform, StyleSheet, View } from "react-native";

/**
 * SkeletonTabs - Loading placeholder para PokemonTabs
 * Coincide exactamente con los estilos de PokemonTabs
 */
export const SkeletonTabs = memo(() => {
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
    <View style={styles.container}>
      <View style={[styles.tabsWrapper, { backgroundColor: colors.tabBackground }]}>
        {/* 3 tab skeletons */}
        {[48, 48, 48].map((_, index) => (
          <View key={index} style={styles.tab}>
            <View style={styles.tabContent}>
              {/* Icon skeleton (círculo) */}
              <Animated.View
                style={[styles.iconSkeleton, { opacity, backgroundColor: colors.skeleton }]}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
});

SkeletonTabs.displayName = "SkeletonTabs";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    zIndex: 10,
  },
  tabsWrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginHorizontal: 16,
    paddingVertical: 10,
    ...Platform.select({
      web: {
        paddingHorizontal: 8,
      },
      default: {
        paddingHorizontal: 0,
      },
    }),
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    minWidth: 48,
  },
  iconSkeleton: {
    width: 20,
    height: 20,
    backgroundColor: "#E2E8F0",
    borderRadius: 10,
  },
});
