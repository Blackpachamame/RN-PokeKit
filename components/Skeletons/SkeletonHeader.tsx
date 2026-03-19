import { useThemeColors } from "@/hooks/useThemedStyles";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { memo, useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const SkeletonHeader = memo(() => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();
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
      colors={[colors.skeleton, colors.backgroundSecondary, colors.skeleton]}
      style={[styles.container, { paddingTop: insets.top + 16 }]}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}>
      <Image
        source={require("@/assets/images/pokeball2.png")}
        style={styles.backgroundIcon}
        contentFit="contain"
      />

      <View style={styles.topRow}>
        <Animated.View
          style={[styles.nameSkeleton, { opacity, backgroundColor: colors.skeletonHighlight }]}
        />
        <Animated.View
          style={[styles.numberSkeleton, { opacity, backgroundColor: colors.skeletonHighlight }]}
        />
      </View>

      <View style={styles.types}>
        <Animated.View
          style={[styles.typeBadge, { opacity, backgroundColor: colors.skeletonHighlight }]}
        />
        <Animated.View
          style={[
            styles.typeBadge,
            { opacity, width: 100, backgroundColor: colors.skeletonHighlight },
          ]}
        />
      </View>

      <Animated.View
        style={[styles.imageSkeleton, { opacity, backgroundColor: colors.skeletonHighlight }]}
      />
    </LinearGradient>
  );
});

SkeletonHeader.displayName = "SkeletonHeader";

const styles = StyleSheet.create({
  container: {
    height: 320,
    paddingTop: 24,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 1,
  },
  nameSkeleton: {
    width: 150,
    height: 32,
    borderRadius: 8,
    flex: 1,
    marginRight: 12,
  },
  numberSkeleton: {
    width: 60,
    height: 18,
    borderRadius: 6,
    marginTop: 8,
    flexShrink: 0,
  },
  backgroundIcon: {
    position: "absolute",
    width: 240,
    height: 240,
    top: 30,
    right: 10,
    opacity: 0.12,
    zIndex: 0,
  },
  types: {
    flexDirection: "row",
    marginTop: 8,
    gap: 8,
    zIndex: 1,
  },
  typeBadge: {
    width: 90,
    height: 30,
    borderRadius: 16,
  },
  imageSkeleton: {
    width: 160,
    height: 160,
    borderRadius: 80,
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    zIndex: 2,
  },
});
