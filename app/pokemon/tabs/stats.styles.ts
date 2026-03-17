import { ThemeColors } from "@/utils/themes";
import { StyleSheet } from "react-native";

const createStatsStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    scrollContent: {
      paddingTop: 32,
      paddingHorizontal: 16,
      paddingBottom: 32,
    },
    container: {
      gap: 16,
    },
    row: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    statName: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.textSecondary,
      textTransform: "capitalize",
      width: 100,
    },
    statValue: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.text,
      width: 40,
      textAlign: "right",
    },
  });
export default createStatsStyles;
