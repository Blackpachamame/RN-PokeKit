import { ThemeColors } from "@/utils/themes";
import { StyleSheet } from "react-native";

const createAboutStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    scrollContent: {
      paddingTop: 32,
      paddingHorizontal: 16,
      paddingBottom: 32,
    },
    container: {
      gap: 24,
      paddingBottom: 16,
    },
    separator: {
      height: 1,
      backgroundColor: colors.divider,
    },
    descriptionContainer: {
      marginBottom: 8,
    },
    description: {
      fontSize: 15,
      lineHeight: 24,
      color: colors.textSecondary,
    },
    dataGrid: { gap: 12 },
    gridRow: { flexDirection: "row", gap: 12 },
    dataCard: { flex: 1, flexDirection: "row", alignItems: "center", gap: 12 },
    dataLabel: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: 8,
    },
    dataValue: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
    },
    section: { gap: 12 },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    categoryText: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.textSecondary,
      textTransform: "capitalize",
    },
    abilitiesText: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.textSecondary,
    },
    weaknessesContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    simpleContainer: { alignItems: "center", gap: 0 },
    downArrowContainer: { paddingVertical: 8 },
    branchedContainer: { alignItems: "center", gap: 16 },
    multiplePathsIndicator: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: colors.backgroundTertiary,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    multiplePathsText: {
      fontSize: 11,
      fontWeight: "600",
      color: colors.textSecondary,
      textTransform: "uppercase",
      letterSpacing: 0.3,
    },
    evolutionGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: 12,
      width: "100%",
    },
    evolutionCardVertical: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 12,
      alignItems: "center",
      borderWidth: 2,
      borderColor: colors.cardBorder,
      width: "47%",
      minWidth: 140,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    evolutionCardCurrent: {
      borderColor: colors.primary,
      backgroundColor: colors.backgroundSecondary,
    },
    evolutionImageVertical: { width: 80, height: 80, marginBottom: 8 },
    evolutionInfoVertical: { alignItems: "center", width: "100%" },
    evolutionNumber: {
      fontSize: 11,
      fontWeight: "600",
      color: colors.textTertiary,
      marginBottom: 2,
    },
    evolutionNameVertical: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.text,
      textTransform: "capitalize",
      textAlign: "center",
    },
    evolutionLevel: {
      fontSize: 11,
      fontWeight: "600",
      color: colors.textSecondary,
      marginTop: 2,
    },
  });

export default createAboutStyles;
