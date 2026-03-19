import { useThemeColors } from "@/hooks/useThemedStyles";
import { ThemeColors } from "@/utils/themes";
import { useMemo } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

export const LoadingState = () => {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.text}>Loading Pokémon...</Text>
    </View>
  );
};

export const ErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>😕</Text>
      <Text style={styles.title}>Oops!</Text>
      <Text style={styles.message}>{error}</Text>
      <Pressable style={styles.button} onPress={onRetry}>
        <Text style={styles.buttonText}>Try Again</Text>
      </Pressable>
    </View>
  );
};

export const SearchingState = () => {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.emptyContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.text}>Searching...</Text>
    </View>
  );
};

export const NoResultsState = () => {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emoji}>🔍</Text>
      <Text style={styles.title}>No Pokémon found</Text>
      <Text style={styles.message}>Try searching for a different name or number</Text>
    </View>
  );
};

export const LoadingMoreFooter = () => {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.footer}>
      <ActivityIndicator size="small" color={colors.primary} />
      <Text style={styles.footerText}>Loading more...</Text>
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 32,
    },
    emptyContainer: {
      paddingVertical: 64,
      alignItems: "center",
    },
    emoji: {
      fontSize: 64,
      marginBottom: 16,
    },
    title: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 8,
      textAlign: "center",
    },
    message: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: "center",
      marginBottom: 24,
    },
    text: {
      marginTop: 16,
      fontSize: 16,
      color: colors.textSecondary,
      fontWeight: "600",
    },
    button: {
      backgroundColor: colors.primary,
      paddingHorizontal: 32,
      paddingVertical: 12,
      borderRadius: 12,
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "700",
    },
    footer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
      gap: 12,
    },
    footerText: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: "600",
    },
  });
