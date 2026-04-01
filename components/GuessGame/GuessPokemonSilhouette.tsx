import { GameState } from "@/hooks/useGuessGame";
import { useThemeColors } from "@/hooks/useThemedStyles";
import { PokemonListItem } from "@/types/pokemon";
import { Image } from "expo-image";
import { useMemo } from "react";
import { ActivityIndicator, Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { createStyles } from "./GuessGame.styles";

interface GuessPokemonSilhouetteProps {
  pokemon: PokemonListItem | null;
  gameState: GameState;
  silhouetteOpacity: Animated.Value;
  revealScale: Animated.Value;
  feedbackOpacity: Animated.Value;
  inputValue: string;
  onRetry: () => void;
}

export function GuessPokemonSilhouette({
  pokemon,
  gameState,
  silhouetteOpacity,
  revealScale,
  feedbackOpacity,
  inputValue,
  onRetry,
}: GuessPokemonSilhouetteProps) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const isRevealed = gameState === "correct" || gameState === "wrong";

  const pokemonNameDisplay = pokemon
    ? pokemon.name.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "";

  return (
    <>
      {/* Imagen */}
      <View style={styles.imageContainer}>
        {gameState === "loading" ? (
          <View style={styles.imagePlaceholder}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : gameState === "error" ? (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.errorEmoji}>😵</Text>
            <Text style={styles.errorText}>Couldn&apos;t load a Pokémon</Text>
            <Pressable style={styles.retryBtn} onPress={onRetry}>
              <Text style={styles.retryBtnText}>Try again</Text>
            </Pressable>
          </View>
        ) : pokemon ? (
          <Animated.View style={[styles.imageWrapper, { transform: [{ scale: revealScale }] }]}>
            {/* Imagen real (debajo) */}
            <Image
              source={{ uri: pokemon.image }}
              style={styles.pokemonImage}
              contentFit="contain"
            />
            {/* Silueta (encima, se desvanece al revelar) */}
            <Animated.View
              style={[
                StyleSheet.absoluteFill,
                styles.silhouetteOverlay,
                { opacity: silhouetteOpacity },
              ]}
              pointerEvents="none">
              <Image
                source={{ uri: pokemon.image }}
                style={styles.pokemonImage}
                contentFit="contain"
                tintColor={colors.text}
              />
            </Animated.View>
          </Animated.View>
        ) : null}
      </View>

      {/* Nombre revelado */}
      <Animated.View style={[styles.feedbackContainer, { opacity: feedbackOpacity }]}>
        {isRevealed && (
          <>
            <Text
              style={[
                styles.pokemonNameRevealed,
                gameState === "correct" ? styles.nameCorrect : styles.nameWrong,
              ]}>
              {pokemonNameDisplay}
            </Text>
            {gameState === "wrong" && inputValue.trim() !== "" && (
              <Text style={styles.wrongGuessText}>You said: &quot;{inputValue.trim()}&quot;</Text>
            )}
          </>
        )}
      </Animated.View>
    </>
  );
}
