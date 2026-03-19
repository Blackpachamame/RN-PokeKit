import { ThemeToggle } from "@/components/ThemeToggle/ThemeToggle";
import { useThemeColors } from "@/hooks/useThemedStyles";
import { ThemeColors } from "@/utils/themes";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function FavoritesHeader() {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors, insets.top), [colors, insets.top]);

  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => router.back()}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
        <ChevronLeft size={26} color={colors.text} strokeWidth={2.5} />
      </TouchableOpacity>
      <Text style={styles.title}>Favorites</Text>
      <ThemeToggle />
    </View>
  );
}

const createStyles = (colors: ThemeColors, paddingTop: number) =>
  StyleSheet.create({
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingTop: paddingTop + 12,
      paddingBottom: 12,
      paddingHorizontal: 16,
      gap: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.background,
    },
    title: {
      flex: 1,
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
    },
  });
