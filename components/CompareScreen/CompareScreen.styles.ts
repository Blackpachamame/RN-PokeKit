import { ThemeColors } from "@/utils/themes";
import { StyleSheet } from "react-native";

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    // Selector
    selectorContainer: {
      marginBottom: 10,
      zIndex: 10,
    },
    searchBox: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 10,
      gap: 10,
      borderWidth: 2,
    },
    searchInput: {
      flex: 1,
      fontSize: 15,
      fontWeight: "500",
      padding: 0,
      height: 22,
    },
    dropdown: {
      backgroundColor: colors.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      marginTop: 4,
      overflow: "hidden",
    },
    dropdownItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 14,
      paddingVertical: 10,
      gap: 10,
    },
    dropdownDivider: {
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    dropdownNumber: {
      fontSize: 11,
      fontWeight: "700",
      color: colors.textTertiary,
      letterSpacing: 0.5,
      width: 44,
    },
    dropdownName: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
      textTransform: "capitalize",
    },
    // Selected card
    selectedCard: {
      backgroundColor: colors.card,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      borderLeftWidth: 4,
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
      gap: 10,
      marginBottom: 10,
    },
    selectedImage: {
      width: 56,
      height: 56,
      flexShrink: 0,
    },
    selectedInfo: {
      flex: 1,
      gap: 2,
    },
    selectedNumber: {
      fontSize: 11,
      fontWeight: "700",
      color: colors.textTertiary,
      letterSpacing: 0.5,
    },
    selectedName: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.text,
      textTransform: "capitalize",
    },
    typesRow: {
      flexDirection: "row",
      gap: 4,
      marginTop: 2,
    },
    typePill: {
      borderRadius: 10,
      paddingHorizontal: 8,
      paddingVertical: 2,
    },
    typePillText: {
      fontSize: 11,
      fontWeight: "600",
      color: "#fff",
      textTransform: "capitalize",
    },
    clearBtn: {
      padding: 4,
    },
    // Stats
    section: {
      backgroundColor: colors.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      padding: 16,
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 11,
      fontWeight: "700",
      color: colors.textTertiary,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: 14,
    },
    statRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginBottom: 8,
    },
    statName: {
      fontSize: 12,
      fontWeight: "600",
      color: colors.textSecondary,
      width: 60,
    },
    statBars: {
      flex: 1,
      gap: 3,
    },
    barWrapper: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    barTrack: {
      flex: 1,
      height: 6,
      borderRadius: 999,
      overflow: "hidden",
    },
    barFill: {
      height: "100%",
      borderRadius: 999,
    },
    statValue: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.text,
      width: 28,
      textAlign: "right",
    },
    legend: {
      flexDirection: "row",
      gap: 16,
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.divider,
    },
    legendItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    legendDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    legendText: {
      fontSize: 12,
      color: colors.textSecondary,
      textTransform: "capitalize",
    },
    // Weaknesses
    weaknessRow: {
      gap: 6,
    },
    weaknessLabel: {
      fontSize: 12,
      fontWeight: "600",
      color: colors.textSecondary,
      textTransform: "capitalize",
    },
    weaknessPills: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 4,
    },
    weaknessDivider: {
      height: 1,
      backgroundColor: colors.divider,
      marginVertical: 10,
    },
  });
