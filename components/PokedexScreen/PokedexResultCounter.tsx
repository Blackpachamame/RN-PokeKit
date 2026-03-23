import { useThemeColors } from "@/hooks/useThemedStyles";
import { useMemo } from "react";
import { Text, View } from "react-native";
import { createStyles } from "./PokedexScreen.styles";

interface PokedexResultCounterProps {
  searchQuery: string;
  selectedTypes: string[];
  isSearching: boolean;
  hasActiveFilters: boolean;
  totalResults: number;
  currentCount: number;
}

export function PokedexResultCounter({
  searchQuery,
  selectedTypes,
  isSearching,
  hasActiveFilters,
  totalResults,
  currentCount,
}: PokedexResultCounterProps) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const label =
    isSearching && hasActiveFilters
      ? `"${searchQuery}" in ${selectedTypes.join(" + ")} • ${totalResults} found`
      : `${totalResults} found • Showing ${currentCount}`;

  return (
    <View style={styles.resultCounter}>
      <Text style={styles.resultCounterText}>{label}</Text>
    </View>
  );
}
