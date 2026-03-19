import { useThemeColors } from "@/hooks/useThemedStyles";
import { ThemeColors } from "@/utils/themes";
import { Heart } from "lucide-react-native";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

export function FavoritesEmpty() {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <Heart size={48} color={colors.textTertiary} strokeWidth={1.5} />
      <Text style={styles.title}>No favorites yet</Text>
      <Text style={styles.description}>Tap the heart on any Pokémon to save it here.</Text>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 40,
      gap: 12,
    },
    title: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
    },
    description: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 22,
    },
  });
