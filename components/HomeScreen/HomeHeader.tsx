import { ThemeToggle } from "@/components/ThemeToggle/ThemeToggle";
import { useThemeColors } from "@/hooks/useThemedStyles";
import { HEADER_HEIGHT } from "@/utils/constants";
import { ThemeColors } from "@/utils/themes";
import { Image } from "expo-image";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

export function HomeHeader() {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.header}>
      <View style={styles.logoRow}>
        <Image
          source={require("@/assets/images/splash-icon.png")}
          style={styles.logo}
          contentFit="contain"
        />
        <Text style={styles.appName}>PokéKit</Text>
      </View>
      <ThemeToggle />
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    header: {
      height: HEADER_HEIGHT,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    logoRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    logo: {
      width: 36,
      height: 36,
    },
    appName: {
      fontSize: 28,
      fontWeight: "800",
      color: colors.text,
      letterSpacing: -0.5,
    },
  });
