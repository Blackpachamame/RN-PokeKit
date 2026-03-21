import { SPACING } from "@/utils/constants";
import { ThemeColors } from "@/utils/themes";
import { Platform, StyleSheet } from "react-native";

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    // Layout
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: SPACING,
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 40,
    },

    // Stats bar
    statsBar: {
      flexDirection: "row",
      marginBottom: 16,
      backgroundColor: colors.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      paddingVertical: 14,
      paddingHorizontal: 8,
      alignItems: "center",
    },
    statItem: {
      flex: 1,
      alignItems: "center",
      gap: 3,
    },
    statLabel: {
      fontSize: 11,
      color: colors.textSecondary,
      fontWeight: "500",
    },
    statValue: {
      fontSize: 18,
      fontWeight: "800",
      color: colors.text,
      lineHeight: 22,
    },
    statValueLarge: {
      fontSize: 24,
    },
    streakValue: {
      color: "#FF6B35",
    },
    statDivider: {
      width: 1,
      height: 32,
      backgroundColor: colors.divider,
    },

    // Dificultad
    difficultyContainer: {
      flexDirection: "row",
      marginBottom: 20,
      gap: 10,
    },
    diffBtn: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderRadius: 14,
      backgroundColor: colors.card,
      borderWidth: 2,
      borderColor: colors.cardBorder,
      alignItems: "center",
      gap: 2,
    },
    diffBtnActive: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + "18",
    },
    diffBtnEmoji: {
      fontSize: 20,
      lineHeight: 24,
    },
    diffBtnText: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.textSecondary,
    },
    diffBtnTextActive: {
      color: colors.text,
    },
    diffBtnSub: {
      fontSize: 11,
      color: colors.textTertiary,
      fontWeight: "500",
    },
    diffBtnSubActive: {
      color: colors.primary + "BB",
    },

    // Imagen / silueta
    imageContainer: {
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 8,
      height: 220,
    },
    imagePlaceholder: {
      width: 200,
      height: 200,
      alignItems: "center",
      justifyContent: "center",
    },
    imageWrapper: {
      width: 200,
      height: 200,
    },
    pokemonImage: {
      width: 200,
      height: 200,
    },
    silhouetteOverlay: {
      alignItems: "center",
      justifyContent: "center",
    },

    // Feedback nombre
    feedbackContainer: {
      alignItems: "center",
      minHeight: 54,
      marginBottom: 8,
    },
    pokemonNameRevealed: {
      fontSize: 26,
      fontWeight: "800",
      letterSpacing: 0.3,
      textAlign: "center",
    },
    nameCorrect: {
      color: "#4CAF50",
    },
    nameWrong: {
      color: "#EF5350",
    },
    wrongGuessText: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 4,
    },

    // Input
    inputSection: {
      gap: 10,
      marginTop: 4,
    },
    inputWrapper: {
      borderRadius: 14,
      overflow: "hidden",
    },
    input: {
      backgroundColor: colors.inputBackground,
      borderWidth: 1.5,
      borderColor: colors.inputBorder,
      borderRadius: 14,
      paddingHorizontal: SPACING,
      paddingVertical: Platform.OS === "ios" ? 14 : 11,
      fontSize: 16,
      color: colors.text,
      fontWeight: "500",
    },
    submitBtn: {
      borderRadius: 14,
      overflow: "hidden",
    },
    submitBtnDisabled: {
      opacity: 0.45,
    },
    submitBtnGradient: {
      paddingVertical: 15,
      alignItems: "center",
      borderRadius: 14,
    },
    submitBtnText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "800",
      letterSpacing: 0.3,
    },
    skipBtn: {
      alignItems: "center",
      paddingVertical: 8,
    },
    skipBtnText: {
      color: colors.textTertiary,
      fontSize: 13,
      fontWeight: "500",
    },
    nextBtn: {
      borderRadius: 14,
      overflow: "hidden",
    },
    nextBtnGradient: {
      paddingVertical: 15,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      borderRadius: 14,
    },
    nextBtnText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "800",
      letterSpacing: 0.3,
    },

    // Best streak
    bestStreakContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 5,
      marginBottom: 16,
    },
    bestStreakText: {
      fontSize: 12,
      color: colors.textTertiary,
      fontWeight: "500",
    },
  });
