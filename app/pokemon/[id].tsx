import PokemonHeader from "@/components/PokemonHeader/PokemonHeader";
import { SkeletonHeader } from "@/components/Skeletons/SkeletonHeader";
import { SkeletonTabContent } from "@/components/Skeletons/SkeletonTabContent";
import { SkeletonTabs } from "@/components/Skeletons/SkeletonTabs";
import { useThemeColors } from "@/hooks/useThemedStyles";
import { fetchPokemonById } from "@/services/pokeapi";
import { PokemonDetails } from "@/types/pokemon";
import { pokemonTypeColors } from "@/utils/pokemonColors";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import styles from "./styles";
import AboutTab from "./tabs/AboutTab";
import MovesTab from "./tabs/MovesTab";
import PokemonTabs from "./tabs/PokemonTabs";
import StatsTab from "./tabs/StatsTab";

export default function PokemonDetailScreen() {
  const colors = useThemeColors();
  const { id } = useLocalSearchParams();
  const pokemonId = Number(id);

  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"about" | "stats" | "evolutions" | "moves">("about");

  useEffect(() => {
    async function loadPokemon() {
      try {
        const data = await fetchPokemonById(pokemonId);
        setPokemon(data);
      } catch (err) {
        console.error(err);
        setError("Error loading the Pokémon");
      } finally {
        setLoading(false);
      }
    }

    if (!isNaN(pokemonId)) {
      loadPokemon();
    }
  }, [pokemonId]);

  // Loading state with skeleton
  if (loading) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.skeleton }]}>
        <SkeletonHeader />
        <View style={styles.tabsWrapper}>
          <SkeletonTabs />
          <View
            style={[
              styles.invertedRadiusContainer,
              { height: 16, backgroundColor: colors.tabBackground, left: 0 },
            ]}>
            <View
              style={[
                styles.invertedRadiusCurve,
                { backgroundColor: colors.skeleton, borderBottomRightRadius: 16 },
              ]}
            />
          </View>
          <View
            style={[
              styles.invertedRadiusContainer,
              { height: 16, backgroundColor: colors.tabBackground, right: 0 },
            ]}>
            <View
              style={[
                styles.invertedRadiusCurve,
                { backgroundColor: colors.skeleton, borderBottomLeftRadius: 16 },
              ]}
            />
          </View>
        </View>
        <View style={[styles.content, { backgroundColor: colors.background }]}>
          <SkeletonTabContent type="about" />
        </View>
      </View>
    );
  }

  // Error state
  if (error || !pokemon) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error || "Pokémon not found"}</Text>
      </View>
    );
  }

  // Success state
  const accentColor = pokemonTypeColors[pokemon.types[0]] || "#6390F0";
  const RADIUS = 16;

  return (
    <View style={[styles.screen, { backgroundColor: accentColor }]}>
      <PokemonHeader
        id={pokemon.id}
        name={pokemon.name}
        image={pokemon.image}
        types={pokemon.types}
        pokemon={{ id: pokemon.id, name: pokemon.name, image: pokemon.image, types: pokemon.types }}
      />

      <View style={styles.tabsWrapper}>
        <PokemonTabs activeTab={activeTab} onTabChange={setActiveTab} accentColor={accentColor} />

        {/* PIEZA DE RADIO INVERTIDO */}
        <View
          style={[
            styles.invertedRadiusContainer,
            { height: RADIUS, backgroundColor: colors.tabBackground, left: 0 },
          ]}>
          <View
            style={[
              styles.invertedRadiusCurve,
              { backgroundColor: accentColor, borderBottomRightRadius: RADIUS },
            ]}
          />
        </View>
        <View
          style={[
            styles.invertedRadiusContainer,
            { height: RADIUS, backgroundColor: colors.tabBackground, right: 0 },
          ]}>
          <View
            style={[
              styles.invertedRadiusCurve,
              { backgroundColor: accentColor, borderBottomLeftRadius: RADIUS },
            ]}
          />
        </View>
      </View>

      {/* Content */}
      <View style={[styles.content, { backgroundColor: colors.background }]}>
        {activeTab === "about" && <AboutTab pokemon={pokemon} currentPokemonId={pokemon.id} />}
        {activeTab === "stats" && <StatsTab stats={pokemon.stats} color={accentColor} />}
        {activeTab === "moves" && <MovesTab moves={pokemon.moves} />}
      </View>
    </View>
  );
}
