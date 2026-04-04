import { ComparePokemon } from "@/hooks/useCompare";
import { useThemeColors } from "@/hooks/useThemedStyles";
import { pokemonTypeColors } from "@/utils/pokemonColors";
import { ThemeColors } from "@/utils/themes";
import { useMemo } from "react";
import { Text, View } from "react-native";
import { createStyles } from "./CompareScreen.styles";

interface CompareWeaknessesProps {
  pokemonA: ComparePokemon;
  pokemonB: ComparePokemon;
}

export function CompareWeaknesses({ pokemonA, pokemonB }: CompareWeaknessesProps) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const sharedWeaknesses = pokemonA.weaknesses.filter((w) => pokemonB.weaknesses.includes(w));

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Weaknesses</Text>

      <WeaknessRow
        label={pokemonA.name}
        weaknesses={pokemonA.weaknesses}
        colors={colors}
        styles={styles}
      />
      <View style={styles.weaknessDivider} />
      <WeaknessRow
        label={pokemonB.name}
        weaknesses={pokemonB.weaknesses}
        colors={colors}
        styles={styles}
      />

      {sharedWeaknesses.length > 0 && (
        <>
          <View style={styles.weaknessDivider} />
          <WeaknessRow
            label="Shared"
            weaknesses={sharedWeaknesses}
            colors={colors}
            styles={styles}
            highlight
          />
        </>
      )}
    </View>
  );
}

function WeaknessRow({
  label,
  weaknesses,
  colors,
  styles,
  highlight = false,
}: {
  label: string;
  weaknesses: string[];
  colors: ThemeColors;
  styles: ReturnType<typeof createStyles>;
  highlight?: boolean;
}) {
  return (
    <View style={styles.weaknessRow}>
      <Text style={[styles.weaknessLabel, highlight && { color: colors.warning }]}>{label}</Text>
      <View style={styles.weaknessPills}>
        {weaknesses.map((w) => (
          <View
            key={w}
            style={[styles.typePill, { backgroundColor: pokemonTypeColors[w] || "#ccc" }]}>
            <Text style={styles.typePillText}>{w}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
