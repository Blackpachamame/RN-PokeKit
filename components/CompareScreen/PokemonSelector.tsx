import { ComparePokemon, CompareSlot } from "@/hooks/useCompare";
import { useThemeColors } from "@/hooks/useThemedStyles";
import { PokemonListIndex } from "@/types/pokemon";
import { pokemonTypeColors } from "@/utils/pokemonColors";
import { Image } from "expo-image";
import { X } from "lucide-react-native";
import { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, TextInput, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { createStyles } from "./CompareScreen.styles";

export const SLOT_A_COLOR = "#F97316";
export const SLOT_B_COLOR = "#8B5CF6";

interface PokemonSelectorProps {
  slot: CompareSlot;
  query: string;
  onChangeQuery: (text: string) => void;
  results: PokemonListIndex[];
  selected: ComparePokemon | null;
  loading: boolean;
  onSelect: (id: number) => void;
  onClear: () => void;
}

export function PokemonSelector({
  slot,
  query,
  onChangeQuery,
  results,
  selected,
  loading,
  onSelect,
  onClear,
}: PokemonSelectorProps) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [isFocused, setIsFocused] = useState(false);

  if (selected) {
    const barColor = slot === "a" ? SLOT_A_COLOR : SLOT_B_COLOR;

    return (
      <View style={[styles.selectedCard, { borderLeftColor: barColor }]}>
        <Image source={{ uri: selected.image }} style={styles.selectedImage} contentFit="contain" />
        <View style={styles.selectedInfo}>
          <Text style={styles.selectedNumber}>#{selected.id.toString().padStart(4, "0")}</Text>
          <Text style={styles.selectedName}>{selected.name}</Text>
          <View style={styles.typesRow}>
            {selected.types.map((type) => (
              <View
                key={type}
                style={[styles.typePill, { backgroundColor: pokemonTypeColors[type] || "#ccc" }]}>
                <Text style={styles.typePillText}>{type}</Text>
              </View>
            ))}
          </View>
        </View>
        <Pressable onPress={onClear} style={styles.clearBtn} hitSlop={8}>
          <X size={16} color={colors.textTertiary} strokeWidth={2.5} />
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.selectorContainer}>
      <View
        style={[
          styles.searchBox,
          {
            backgroundColor: colors.inputBackground,
            borderColor: isFocused ? colors.inputBorderFocused : colors.inputBorder,
          },
        ]}>
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
          <Circle
            cx="11"
            cy="11"
            r="7"
            stroke={isFocused ? colors.primary : colors.textTertiary}
            strokeWidth={2}
          />
          <Path
            d="M21 21L16.65 16.65"
            stroke={isFocused ? colors.primary : colors.textTertiary}
            strokeWidth={2}
            strokeLinecap="round"
          />
        </Svg>
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search Pokémon..."
          placeholderTextColor={colors.textTertiary}
          value={query}
          onChangeText={onChangeQuery}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoCorrect={false}
          autoCapitalize="none"
          maxLength={50}
        />
        {loading && <ActivityIndicator size="small" color={colors.primary} />}
      </View>

      {results.length > 0 && (
        <View style={styles.dropdown}>
          <FlatList
            data={results}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            renderItem={({ item, index: i }) => (
              <Pressable
                style={[styles.dropdownItem, i < results.length - 1 && styles.dropdownDivider]}
                onPress={() => onSelect(item.id)}>
                <Text style={styles.dropdownNumber}>#{item.id.toString().padStart(4, "0")}</Text>
                <Text style={styles.dropdownName}>{item.name}</Text>
              </Pressable>
            )}
          />
        </View>
      )}
    </View>
  );
}
