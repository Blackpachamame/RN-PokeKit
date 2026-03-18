import { useThemeColors } from "@/hooks/useThemedStyles";
import { ThemeColors } from "@/utils/themes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ArrowLeft, ChevronRight, Flame, Trophy } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Constantes ────────────────────────────────────────────────────────────────

const EASY_MAX = 151; // Gen 1
const HARD_MAX = 1025; // Todos

const STORAGE_KEYS = {
  record: "guess_record",
  bestStreak: "guess_best_streak",
};

// Normaliza texto para comparación: minúsculas, sin acentos, sin guiones
function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[-\s]/g, "");
}

// ─── Tipos ─────────────────────────────────────────────────────────────────────

type Difficulty = "easy" | "hard";
type GameState = "loading" | "playing" | "correct" | "wrong";

interface PokemonData {
  id: number;
  name: string;
  image: string;
  types: string[];
}

// ─── Servicio ──────────────────────────────────────────────────────────────────

async function fetchRandomPokemon(difficulty: Difficulty): Promise<PokemonData> {
  const max = difficulty === "easy" ? EASY_MAX : HARD_MAX;
  const id = Math.floor(Math.random() * max) + 1;

  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const data = await res.json();

  return {
    id,
    name: data.name,
    image: data.sprites.other["official-artwork"].front_default ?? data.sprites.front_default,
    types: data.types.map((t: any) => t.type.name) as string[],
  };
}

// ─── Componente principal ──────────────────────────────────────────────────────

export default function GuessScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  // Estado del juego
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [pokemon, setPokemon] = useState<PokemonData | null>(null);
  const [gameState, setGameState] = useState<GameState>("loading");
  const [inputValue, setInputValue] = useState("");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [record, setRecord] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  // Animaciones
  const silhouetteOpacity = useRef(new Animated.Value(1)).current; // 1 = silueta, 0 = reveal
  const revealScale = useRef(new Animated.Value(0.85)).current;
  const feedbackOpacity = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const inputRef = useRef<TextInput>(null);

  // ── Persistencia ────────────────────────────────────────────────────────────

  useEffect(() => {
    (async () => {
      const [savedRecord, savedBestStreak] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.record),
        AsyncStorage.getItem(STORAGE_KEYS.bestStreak),
      ]);
      if (savedRecord) setRecord(Number(savedRecord));
      if (savedBestStreak) setBestStreak(Number(savedBestStreak));
    })();
  }, []);

  const saveRecord = useCallback(async (newRecord: number) => {
    setRecord(newRecord);
    await AsyncStorage.setItem(STORAGE_KEYS.record, String(newRecord));
  }, []);

  const saveBestStreak = useCallback(async (newBest: number) => {
    setBestStreak(newBest);
    await AsyncStorage.setItem(STORAGE_KEYS.bestStreak, String(newBest));
  }, []);

  // ── Cargar pokémon ───────────────────────────────────────────────────────────

  const loadPokemon = useCallback(
    async (diff: Difficulty = difficulty) => {
      setGameState("loading");
      setInputValue("");

      // Reset animaciones
      silhouetteOpacity.setValue(1);
      revealScale.setValue(0.85);
      feedbackOpacity.setValue(0);

      try {
        const p = await fetchRandomPokemon(diff);
        setPokemon(p);
        setGameState("playing");
        // Foco en el input con pequeño delay
        setTimeout(() => inputRef.current?.focus(), 300);
      } catch (e) {
        // Reintento silencioso
        loadPokemon(diff);
      }
    },
    [difficulty],
  );

  useEffect(() => {
    loadPokemon();
  }, []);

  // Al cambiar dificultad, cargar nuevo pokémon y resetear puntaje de racha
  const handleDifficultyChange = (diff: Difficulty) => {
    if (diff === difficulty) return;
    setDifficulty(diff);
    setScore(0);
    setStreak(0);
    loadPokemon(diff);
  };

  // ── Animación de reveal ──────────────────────────────────────────────────────

  const animateReveal = () => {
    Animated.parallel([
      Animated.timing(silhouetteOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(revealScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(feedbackOpacity, {
        toValue: 1,
        duration: 300,
        delay: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateShake = () => {
    shakeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
    Animated.timing(feedbackOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleSubmit = () => {
    if (!pokemon || gameState !== "playing" || !inputValue.trim()) return;
    Keyboard.dismiss();

    const isCorrect = normalize(inputValue.trim()) === normalize(pokemon.name);

    if (isCorrect) {
      const newScore = score + 1;
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);
      setGameState("correct");
      if (newScore > record) saveRecord(newScore);
      if (newStreak > bestStreak) saveBestStreak(newStreak);
    } else {
      setStreak(0);
      setGameState("wrong");
      animateShake();
    }

    animateReveal();
  };

  const handleNext = () => {
    loadPokemon();
  };

  // ── Render helpers ───────────────────────────────────────────────────────────

  const pokemonNameDisplay = pokemon
    ? pokemon.name.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "";

  const isRevealed = gameState === "correct" || gameState === "wrong";

  // ── UI ───────────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={22} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>¿Quién es ese Pokémon?</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Stats bar */}
        <View style={styles.statsBar}>
          <View style={styles.statItem}>
            <Trophy size={15} color={colors.warning} />
            <Text style={styles.statLabel}>Récord</Text>
            <Text style={styles.statValue}>{record}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Puntaje</Text>
            <Text style={[styles.statValue, styles.statValueLarge]}>{score}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Flame size={15} color={streak > 0 ? "#FF6B35" : colors.textTertiary} />
            <Text style={styles.statLabel}>Racha</Text>
            <Text style={[styles.statValue, streak > 0 && styles.streakValue]}>{streak}</Text>
          </View>
        </View>

        {/* Selector de dificultad */}
        <View style={styles.difficultyContainer}>
          <TouchableOpacity
            style={[styles.diffBtn, difficulty === "easy" && styles.diffBtnActive]}
            onPress={() => handleDifficultyChange("easy")}
            activeOpacity={0.7}>
            <Text style={[styles.diffBtnText, difficulty === "easy" && styles.diffBtnTextActive]}>
              😊 Fácil
            </Text>
            <Text style={[styles.diffBtnSub, difficulty === "easy" && styles.diffBtnSubActive]}>
              Gen 1 · 151
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.diffBtn, difficulty === "hard" && styles.diffBtnActive]}
            onPress={() => handleDifficultyChange("hard")}
            activeOpacity={0.7}>
            <Text style={[styles.diffBtnText, difficulty === "hard" && styles.diffBtnTextActive]}>
              💀 Difícil
            </Text>
            <Text style={[styles.diffBtnSub, difficulty === "hard" && styles.diffBtnSubActive]}>
              Todos · 1025
            </Text>
          </TouchableOpacity>
        </View>

        {/* Área de imagen */}
        <View style={styles.imageContainer}>
          {gameState === "loading" ? (
            <View style={styles.imagePlaceholder}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : pokemon ? (
            <Animated.View style={[styles.imageWrapper, { transform: [{ scale: revealScale }] }]}>
              {/* Imagen revelada (debajo) */}
              <Image
                source={{ uri: pokemon.image }}
                style={styles.pokemonImage}
                contentFit="contain"
              />
              {/* Silueta (encima, desaparece con animación) */}
              <Animated.View
                style={[
                  StyleSheet.absoluteFill,
                  styles.silhouetteOverlay,
                  { opacity: silhouetteOpacity },
                ]}
                pointerEvents="none">
                <Image
                  source={{ uri: pokemon.image }}
                  style={[styles.pokemonImage, styles.silhouette]}
                  contentFit="contain"
                  tintColor="#000000"
                />
              </Animated.View>
            </Animated.View>
          ) : null}
        </View>

        {/* Feedback de nombre */}
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
                <Text style={styles.wrongGuessText}>Dijiste: &quot;{inputValue.trim()}&quot;</Text>
              )}
            </>
          )}
        </Animated.View>

        {/* Input y botones */}
        <View style={styles.inputSection}>
          {!isRevealed ? (
            <>
              <Animated.View
                style={[styles.inputWrapper, { transform: [{ translateX: shakeAnim }] }]}>
                <TextInput
                  ref={inputRef}
                  style={styles.input}
                  value={inputValue}
                  onChangeText={setInputValue}
                  placeholder="Escribe el nombre…"
                  placeholderTextColor={colors.textTertiary}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit}
                  editable={gameState === "playing"}
                />
              </Animated.View>
              <TouchableOpacity
                style={[
                  styles.submitBtn,
                  (!inputValue.trim() || gameState !== "playing") && styles.submitBtnDisabled,
                ]}
                onPress={handleSubmit}
                disabled={!inputValue.trim() || gameState !== "playing"}
                activeOpacity={0.8}>
                <LinearGradient
                  colors={["#EF5350", "#CC3333"]}
                  style={styles.submitBtnGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}>
                  <Text style={styles.submitBtnText}>¡Es este!</Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Saltar */}
              <TouchableOpacity
                style={styles.skipBtn}
                onPress={() => {
                  setStreak(0);
                  setGameState("wrong");
                  setInputValue("");
                  animateReveal();
                }}
                activeOpacity={0.6}>
                <Text style={styles.skipBtnText}>No sé, revelar</Text>
              </TouchableOpacity>
            </>
          ) : (
            /* Botón Siguiente */
            <TouchableOpacity style={styles.nextBtn} onPress={handleNext} activeOpacity={0.8}>
              <LinearGradient
                colors={gameState === "correct" ? ["#4CAF50", "#388E3C"] : ["#EF5350", "#CC3333"]}
                style={styles.nextBtnGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}>
                <Text style={styles.nextBtnText}>
                  {gameState === "correct" ? "¡Siguiente! 🎉" : "Intentar de nuevo"}
                </Text>
                <ChevronRight size={20} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>

        {/* Mejor racha */}
        {bestStreak > 0 && (
          <View style={styles.bestStreakContainer}>
            <Flame size={13} color="#FF6B35" />
            <Text style={styles.bestStreakText}>Mejor racha: {bestStreak}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 40,
    },

    // Header
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    backBtn: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: colors.card,
      alignItems: "center",
      justifyContent: "center",
    },
    headerTitle: {
      flex: 1,
      textAlign: "center",
      fontSize: 17,
      fontWeight: "700",
      color: colors.text,
    },
    headerRight: {
      width: 38,
    },

    // Stats
    statsBar: {
      flexDirection: "row",
      marginHorizontal: 16,
      marginBottom: 16,
      backgroundColor: colors.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      paddingVertical: 14,
      paddingHorizontal: 8,
      alignItems: "center",
    },
    statItem: {
      flex: 1,
      alignItems: "center",
      gap: 3,
    },
    statLabel: {
      fontSize: 11,
      color: colors.textSecondary,
      fontWeight: "500",
    },
    statValue: {
      fontSize: 18,
      fontWeight: "800",
      color: colors.text,
      lineHeight: 22,
    },
    statValueLarge: {
      fontSize: 24,
    },
    streakValue: {
      color: "#FF6B35",
    },
    statDivider: {
      width: 1,
      height: 32,
      backgroundColor: colors.divider,
    },

    // Dificultad
    difficultyContainer: {
      flexDirection: "row",
      marginHorizontal: 16,
      marginBottom: 20,
      gap: 10,
    },
    diffBtn: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderRadius: 14,
      backgroundColor: colors.card,
      borderWidth: 2,
      borderColor: colors.cardBorder,
      alignItems: "center",
      gap: 2,
    },
    diffBtnActive: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + "18",
    },
    diffBtnText: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.textSecondary,
    },
    diffBtnTextActive: {
      color: colors.primary,
    },
    diffBtnSub: {
      fontSize: 11,
      color: colors.textTertiary,
      fontWeight: "500",
    },
    diffBtnSubActive: {
      color: colors.primary + "BB",
    },

    // Imagen
    imageContainer: {
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 8,
      height: 220,
    },
    imagePlaceholder: {
      width: 200,
      height: 200,
      alignItems: "center",
      justifyContent: "center",
    },
    imageWrapper: {
      width: 200,
      height: 200,
      position: "relative",
    },
    pokemonImage: {
      width: 200,
      height: 200,
    },
    silhouetteOverlay: {
      alignItems: "center",
      justifyContent: "center",
    },
    silhouette: {
      // tintColor en Image de expo-image se pasa como prop
    },

    // Feedback
    feedbackContainer: {
      alignItems: "center",
      minHeight: 54,
      marginBottom: 8,
      paddingHorizontal: 16,
    },
    pokemonNameRevealed: {
      fontSize: 26,
      fontWeight: "800",
      letterSpacing: 0.3,
      textAlign: "center",
    },
    nameCorrect: {
      color: "#4CAF50",
    },
    nameWrong: {
      color: "#EF5350",
    },
    wrongGuessText: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 4,
    },

    // Input
    inputSection: {
      paddingHorizontal: 16,
      gap: 10,
      marginTop: 4,
    },
    inputWrapper: {
      borderRadius: 14,
      overflow: "hidden",
    },
    input: {
      backgroundColor: colors.inputBackground,
      borderWidth: 1.5,
      borderColor: colors.inputBorder,
      borderRadius: 14,
      paddingHorizontal: 16,
      paddingVertical: Platform.OS === "ios" ? 14 : 11,
      fontSize: 16,
      color: colors.text,
      fontWeight: "500",
    },
    submitBtn: {
      borderRadius: 14,
      overflow: "hidden",
    },
    submitBtnDisabled: {
      opacity: 0.45,
    },
    submitBtnGradient: {
      paddingVertical: 15,
      alignItems: "center",
      borderRadius: 14,
    },
    submitBtnText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "800",
      letterSpacing: 0.3,
    },
    skipBtn: {
      alignItems: "center",
      paddingVertical: 8,
    },
    skipBtnText: {
      color: colors.textTertiary,
      fontSize: 13,
      fontWeight: "500",
    },
    nextBtn: {
      borderRadius: 14,
      overflow: "hidden",
    },
    nextBtnGradient: {
      paddingVertical: 15,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      borderRadius: 14,
    },
    nextBtnText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "800",
      letterSpacing: 0.3,
    },

    // Mejor racha
    bestStreakContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 5,
      marginTop: 20,
    },
    bestStreakText: {
      fontSize: 12,
      color: colors.textTertiary,
      fontWeight: "500",
    },
  });
