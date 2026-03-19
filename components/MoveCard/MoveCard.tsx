import { useThemeColors } from "@/hooks/useThemedStyles";
import { pokemonTypeColors } from "@/utils/pokemonColors";
import { useMemo } from "react";
import { Text, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { createMoveCardStyles } from "./styles";

type Props = {
  name: string;
  type: string;
  category: "physical" | "special" | "status";
  power: number | null;
  accuracy: number | null;
  pp: number;
  levelLearnedAt: number | null;
};

export default function MoveCard({
  name,
  type,
  category,
  power,
  accuracy,
  pp,
  levelLearnedAt,
}: Props) {
  const colors = useThemeColors();
  const styles = useMemo(() => createMoveCardStyles(colors), [colors]);
  const typeColor = pokemonTypeColors[type as keyof typeof pokemonTypeColors] || "#94A3B8";

  // Formatear nombre (ej: "thunder-punch" → "Thunder Punch")
  const formattedName = name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // Icono según categoría
  const CategoryIcon = () => {
    switch (category) {
      case "physical":
        return (
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Path
              d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
              fill="#F59E0B"
              stroke="#F59E0B"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        );
      case "special":
        return (
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Circle cx={12} cy={12} r={10} fill="#8B5CF6" />
            <Path
              d="M12 8V12L15 15"
              stroke="white"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        );
      default:
        return (
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Circle
              cx={12}
              cy={12}
              r={10}
              stroke="#64748B"
              strokeWidth={2}
              fill="none"
              strokeDasharray="2 2"
            />
          </Svg>
        );
    }
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{formattedName}</Text>
          {levelLearnedAt !== null && (
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>Lv. {levelLearnedAt}</Text>
            </View>
          )}
        </View>

        <View style={styles.typeBadge}>
          <View style={[styles.typeDot, { backgroundColor: typeColor }]} />
          <Text style={styles.typeText}>{type}</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.stats}>
        {/* Category */}
        <View style={styles.stat}>
          <CategoryIcon />
          <Text style={styles.statLabel}>{category}</Text>
        </View>

        {/* Power */}
        <View style={styles.stat}>
          <View style={styles.statIcon}>
            <Text style={styles.statIconText}>⚡</Text>
          </View>
          <Text style={styles.statValue}>{power !== null ? power : "—"}</Text>
        </View>

        {/* Accuracy */}
        <View style={styles.stat}>
          <View style={styles.statIcon}>
            <Text style={styles.statIconText}>🎯</Text>
          </View>
          <Text style={styles.statValue}>{accuracy !== null ? `${accuracy}%` : "—"}</Text>
        </View>

        {/* PP */}
        <View style={styles.stat}>
          <View style={styles.statIcon}>
            <Text style={styles.statIconText}>💫</Text>
          </View>
          <Text style={styles.statValue}>{pp}</Text>
        </View>
      </View>
    </View>
  );
}
