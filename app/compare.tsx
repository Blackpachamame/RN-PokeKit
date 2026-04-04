import { CompareStats } from "@/components/CompareScreen/CompareStats";
import { CompareWeaknesses } from "@/components/CompareScreen/CompareWeaknesses";
import { PokemonSelector } from "@/components/CompareScreen/PokemonSelector";
import { ScreenHeader } from "@/components/ScreenHeader/ScreenHeader";
import { useCompare } from "@/hooks/useCompare";
import { useThemeColors } from "@/hooks/useThemedStyles";
import { SPACING } from "@/utils/constants";
import { ThemeColors } from "@/utils/themes";
import { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CompareScreen() {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const {
    queryA,
    setQueryA,
    queryB,
    setQueryB,
    resultsA,
    resultsB,
    pokemonA,
    pokemonB,
    loadingA,
    loadingB,
    selectPokemon,
    clearSlot,
  } = useCompare();

  const bothSelected = pokemonA !== null && pokemonB !== null;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Compare" />

        {/* Slot A */}
        <PokemonSelector
          slot="a"
          query={queryA}
          onChangeQuery={setQueryA}
          results={resultsA}
          selected={pokemonA}
          loading={loadingA}
          onSelect={(id) => selectPokemon("a", id)}
          onClear={() => clearSlot("a")}
        />

        {/* VS divider */}
        <View style={styles.vsDivider}>
          <View style={styles.vsLine} />
          <Text style={styles.vsText}>VS</Text>
          <View style={styles.vsLine} />
        </View>

        {/* Slot B */}
        <PokemonSelector
          slot="b"
          query={queryB}
          onChangeQuery={setQueryB}
          results={resultsB}
          selected={pokemonB}
          loading={loadingB}
          onSelect={(id) => selectPokemon("b", id)}
          onClear={() => clearSlot("b")}
        />

        {/* Comparación */}
        {bothSelected ? (
          <View style={styles.comparison}>
            <CompareStats pokemonA={pokemonA} pokemonB={pokemonB} />
            <CompareWeaknesses pokemonA={pokemonA} pokemonB={pokemonB} />
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {pokemonA || pokemonB
                ? "Select a second Pokémon to compare"
                : "Select two Pokémon to compare their stats and weaknesses"}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
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
    vsDivider: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginVertical: 6,
    },
    vsLine: {
      flex: 1,
      height: 1,
      backgroundColor: colors.divider,
    },
    vsText: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.textTertiary,
      letterSpacing: 1,
    },
    comparison: {
      marginTop: 16,
    },
    emptyState: {
      marginTop: 40,
      alignItems: "center",
      paddingHorizontal: 24,
    },
    emptyText: {
      fontSize: 14,
      color: colors.textTertiary,
      textAlign: "center",
      lineHeight: 22,
    },
  });
