import { SPACING } from "@/utils/constants";
import { ThemeColors } from "@/utils/themes";
import { StyleSheet } from "react-native";

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: SPACING,
    },
    sectionLabel: {
      fontSize: 16,
      color: colors.text,
      marginBottom: 14,
    },
    cardsContainer: {
      flex: 1,
      gap: 14,
    },
    footer: {
      alignItems: "center",
      paddingBottom: 8,
    },
    footerText: {
      fontSize: 12,
      color: colors.textTertiary,
      fontWeight: "500",
    },
  });
