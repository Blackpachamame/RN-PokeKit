import { ThemeToggle } from "@/components/ThemeToggle/ThemeToggle";
import { useThemeColors } from "@/hooks/useThemedStyles";
import { HEADER_HEIGHT } from "@/utils/constants";
import { ThemeColors } from "@/utils/themes";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ScreenHeaderProps {
  title: string;
}

export function ScreenHeader({ title }: ScreenHeaderProps) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => router.back()}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
        <ChevronLeft size={26} color={colors.text} strokeWidth={2.5} />
      </TouchableOpacity>

      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

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
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
    },
  });
