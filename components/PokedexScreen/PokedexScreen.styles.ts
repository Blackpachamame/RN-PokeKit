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
    skeletonContainer: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: SPACING,
    },
    listContainer: {
      paddingBottom: 32,
    },
    resultCounter: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      backgroundColor: colors.counterBackground,
      borderRadius: 8,
      marginBottom: 12,
      alignSelf: "flex-start",
    },
    resultCounterText: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.counterText,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
  });
