import { ThemeColors } from "@/utils/themes";
import { StyleSheet } from "react-native";

const createMovesStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    listContainer: {
      padding: 20,
      paddingBottom: 32,
    },
    separator: {
      height: 12,
    },
    emptyState: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 32,
    },
    emptyEmoji: {
      fontSize: 64,
      marginBottom: 16,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 8,
    },
    emptyMessage: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: "center",
    },
  });
export default createMovesStyles;
