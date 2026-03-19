import { useThemeColors } from "@/hooks/useThemedStyles";
import { ThemeColors } from "@/utils/themes";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

interface FavoritesCounterProps {
  count: number;
}

export function FavoritesCounter({ count }: FavoritesCounterProps) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.counterRow}>
      <Text style={styles.counterText}>
        {count} {count === 1 ? "Pokémon saved" : "Pokémon saved"}
      </Text>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    counterRow: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    counterText: {
      fontSize: 13,
      color: colors.textSecondary,
      fontWeight: "600",
    },
  });
