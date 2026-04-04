import { ComparePokemon } from "@/hooks/useCompare";
import { useThemeColors } from "@/hooks/useThemedStyles";
import { useMemo } from "react";
import { Text, View } from "react-native";
import { createStyles } from "./CompareScreen.styles";

export const SLOT_A_COLOR = "#F97316";
export const SLOT_B_COLOR = "#8B5CF6";

const STAT_LABELS: Record<string, string> = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  "special-attack": "Sp. Atk",
  "special-defense": "Sp. Def",
  speed: "Speed",
};

interface CompareStatsProps {
  pokemonA: ComparePokemon;
  pokemonB: ComparePokemon;
}

export function CompareStats({ pokemonA, pokemonB }: CompareStatsProps) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const colorA = SLOT_A_COLOR;
  const colorB = SLOT_B_COLOR;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Stats</Text>

      {pokemonA.stats?.map((statA) => {
        const statB = pokemonB.stats?.find((s) => s.name === statA.name);
        const valA = statA.value;
        const valB = statB?.value ?? 0;
        const max = Math.max(valA, valB, 1);

        return (
          <View key={statA.name} style={styles.statRow}>
            <Text style={styles.statName}>{STAT_LABELS[statA.name] ?? statA.name}</Text>
            <View style={styles.statBars}>
              <View style={styles.barWrapper}>
                <View style={[styles.barTrack, { backgroundColor: colors.backgroundTertiary }]}>
                  <View
                    style={[
                      styles.barFill,
                      { width: `${(valA / max) * 100}%`, backgroundColor: colorA },
                    ]}
                  />
                </View>
                <Text style={styles.statValue}>{valA}</Text>
              </View>
              <View style={styles.barWrapper}>
                <View style={[styles.barTrack, { backgroundColor: colors.backgroundTertiary }]}>
                  <View
                    style={[
                      styles.barFill,
                      { width: `${(valB / max) * 100}%`, backgroundColor: colorB },
                    ]}
                  />
                </View>
                <Text style={styles.statValue}>{valB}</Text>
              </View>
            </View>
          </View>
        );
      })}

      {/* Leyenda */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colorA }]} />
          <Text style={styles.legendText}>{pokemonA.name}</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colorB }]} />
          <Text style={styles.legendText}>{pokemonB.name}</Text>
        </View>
      </View>
    </View>
  );
}
