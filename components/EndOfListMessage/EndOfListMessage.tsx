import { useThemeColors } from "@/hooks/useThemedStyles";
import { ThemeColors } from "@/utils/themes";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

export const EndOfListMessage = () => {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>✨</Text>
      <Text style={styles.text}>You&apos;ve seen them all!</Text>
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      paddingVertical: 32,
      alignItems: "center",
    },
    emoji: {
      fontSize: 48,
      marginBottom: 12,
    },
    text: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.textSecondary,
    },
  });
