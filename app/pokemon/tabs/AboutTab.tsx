import { TypeBadge } from "@/components/TypeBadge/TypeBadge";
import { useThemeColors } from "@/hooks/useThemedStyles";
import { EvolutionChain } from "@/types/pokemon";
import { Image } from "expo-image";
import { ArrowDown, GitBranch, LucideIcon, MoveVertical, Weight } from "lucide-react-native";
import { useMemo } from "react";
import { ScrollView, Text, View } from "react-native";
import createAboutStyles from "./about.styles";

type Props = {
  pokemon: {
    description: string;
    height: number;
    weight: number;
    abilities: string[];
    category: string;
    weaknesses: string[];
    evolutionChain: EvolutionChain[];
  };
  currentPokemonId: number;
};

export default function AboutTab({ pokemon, currentPokemonId }: Props) {
  const colors = useThemeColors();
  const styles = useMemo(() => createAboutStyles(colors), [colors]);
  const { description, height, weight, abilities, category, weaknesses, evolutionChain } = pokemon;

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        {/* Descripción */}
        {description && (
          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>{description}</Text>
          </View>
        )}

        {/* Pokédex Data Grid */}
        <View style={styles.dataGrid}>
          <View style={styles.gridRow}>
            <DataCard label="Weight" value={`${(weight / 10).toFixed(1)} kg`} icon={Weight} />
            <DataCard label="Height" value={`${(height / 10).toFixed(1)} m`} icon={MoveVertical} />
          </View>
        </View>
        <View style={styles.separator} />

        {/* Category */}
        {category && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Category</Text>
            <Text style={styles.categoryText}>{category}</Text>
          </View>
        )}
        <View style={styles.separator} />

        {/* Abilities */}
        {abilities.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Abilities</Text>
            <Text style={styles.abilitiesText}>
              {abilities
                .map((ability) =>
                  ability
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" "),
                )
                .join(", ")}
            </Text>
          </View>
        )}
        <View style={styles.separator} />

        {/* Weaknesses */}
        {weaknesses.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Weaknesses</Text>
            <View style={styles.weaknessesContainer}>
              {weaknesses.map((weakness) => (
                <TypeBadge key={weakness} type={weakness} variant="badge" extend={true} />
              ))}
            </View>
          </View>
        )}

        {/* Evolutions */}
        {evolutionChain.length > 1 && (
          <>
            <View style={styles.separator} />
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Evolution Chain</Text>
              <EvolutionChainView evolutions={evolutionChain} currentPokemonId={currentPokemonId} />
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}

// Componente para cards de datos (Weight/Height)
function DataCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
}) {
  const colors = useThemeColors();
  const styles = useMemo(() => createAboutStyles(colors), [colors]);
  return (
    <View style={styles.dataCard}>
      <View>
        <Text style={styles.dataLabel}>{label}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Icon size={18} color="#64748B" />
          <Text style={styles.dataValue}>{value}</Text>
        </View>
      </View>
    </View>
  );
}

// Componente para mostrar la cadena de evolución
function EvolutionChainView({
  evolutions,
  currentPokemonId,
}: {
  evolutions: EvolutionChain[];
  currentPokemonId: number;
}) {
  const evolutionCount = evolutions.length;

  // Layout 1: Vertical (1-3 evoluciones)
  if (evolutionCount <= 3) {
    return <SimpleEvolution evolutions={evolutions} currentPokemonId={currentPokemonId} />;
  }

  // Layout 2: Branched (4+ evoluciones)
  return <BranchedEvolution evolutions={evolutions} currentPokemonId={currentPokemonId} />;
}

// Layout 1: Simple vertical (1-3 evoluciones)
function SimpleEvolution({
  evolutions,
  currentPokemonId,
}: {
  evolutions: EvolutionChain[];
  currentPokemonId: number;
}) {
  const colors = useThemeColors();
  const styles = useMemo(() => createAboutStyles(colors), [colors]);
  return (
    <View style={styles.simpleContainer}>
      {evolutions.map((evolution, index) => {
        const isCurrent = evolution.id === currentPokemonId;
        const isLast = index === evolutions.length - 1;

        return (
          <View key={evolution.id} style={styles.simpleContainer}>
            <EvolutionCardVertical evolution={evolution} isCurrent={isCurrent} />
            {!isLast && (
              <View style={styles.downArrowContainer}>
                <ArrowDown size={24} color="#CBD5E1" strokeWidth={2.5} />
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

// Layout 2: Branched (Eevee, Tyrogue)
function BranchedEvolution({
  evolutions,
  currentPokemonId,
}: {
  evolutions: EvolutionChain[];
  currentPokemonId: number;
}) {
  const colors = useThemeColors();
  const styles = useMemo(() => createAboutStyles(colors), [colors]);
  const baseEvolution = evolutions[0];
  const branchedEvolutions = evolutions.slice(1);

  return (
    <View style={styles.branchedContainer}>
      {/* Indicador de múltiples rutas */}
      <View style={styles.multiplePathsIndicator}>
        <GitBranch size={14} color="#F59E0B" />
        <Text style={styles.multiplePathsText}>
          {branchedEvolutions.length} evolution path{branchedEvolutions.length > 1 ? "s" : ""}{" "}
          available
        </Text>
      </View>

      {/* Base evolution */}
      <EvolutionCardVertical
        evolution={baseEvolution}
        isCurrent={baseEvolution.id === currentPokemonId}
      />

      {/* Flecha hacia abajo */}
      <View style={styles.downArrowContainer}>
        <ArrowDown size={24} color="#CBD5E1" strokeWidth={2.5} />
      </View>

      {/* Grid de evoluciones */}
      <View style={styles.evolutionGrid}>
        {branchedEvolutions.map((evolution) => (
          <EvolutionCardVertical
            key={evolution.id}
            evolution={evolution}
            isCurrent={evolution.id === currentPokemonId}
          />
        ))}
      </View>
    </View>
  );
}

// Card vertical para evolución simple y branched
function EvolutionCardVertical({
  evolution,
  isCurrent,
}: {
  evolution: EvolutionChain;
  isCurrent: boolean;
}) {
  const colors = useThemeColors();
  const styles = useMemo(() => createAboutStyles(colors), [colors]);
  return (
    <View style={[styles.evolutionCardVertical, isCurrent && styles.evolutionCardCurrent]}>
      <Image
        source={{ uri: evolution.image }}
        style={styles.evolutionImageVertical}
        contentFit="contain"
      />
      <View style={styles.evolutionInfoVertical}>
        <Text style={styles.evolutionNumber}>#{evolution.id.toString().padStart(3, "0")}</Text>
        <Text style={styles.evolutionNameVertical}>
          {evolution.name.charAt(0).toUpperCase() + evolution.name.slice(1)}
        </Text>
        {evolution.minLevel && <Text style={styles.evolutionLevel}>Lv. {evolution.minLevel}</Text>}
      </View>
    </View>
  );
}
