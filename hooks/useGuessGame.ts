import { fetchRandomPokemon } from "@/services/pokeapi";
import { PokemonListItem } from "@/types/pokemon";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Keyboard } from "react-native";

// Tipos
export type Difficulty = "easy" | "hard";
export type GameState = "loading" | "playing" | "correct" | "wrong" | "error";

// Helpers
const STORAGE_KEYS = {
  record: "guess_record",
  bestStreak: "guess_best_streak",
};

const MAX_RETRIES = 3;

export function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[-\s]/g, "");
}

// Hook
export function useGuessGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [pokemon, setPokemon] = useState<PokemonListItem | null>(null);
  const [gameState, setGameState] = useState<GameState>("loading");
  const [inputValue, setInputValue] = useState("");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [record, setRecord] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  // Animaciones expuestas para los componentes
  const silhouetteOpacity = useRef(new Animated.Value(1)).current;
  const revealScale = useRef(new Animated.Value(0.85)).current;
  const feedbackOpacity = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // Persistencia
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

  const saveRecord = useCallback(async (value: number) => {
    setRecord(value);
    await AsyncStorage.setItem(STORAGE_KEYS.record, String(value));
  }, []);

  const saveBestStreak = useCallback(async (value: number) => {
    setBestStreak(value);
    await AsyncStorage.setItem(STORAGE_KEYS.bestStreak, String(value));
  }, []);

  // Animaciones
  const animateReveal = useCallback(() => {
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
  }, [silhouetteOpacity, revealScale, feedbackOpacity]);

  const animateShake = useCallback(() => {
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
  }, [shakeAnim, feedbackOpacity]);

  // Cargar pokémon con límite de reintentos
  const loadPokemon = useCallback(
    async (diff: Difficulty = difficulty, attempt: number = 0) => {
      setGameState("loading");
      setInputValue("");
      silhouetteOpacity.setValue(1);
      revealScale.setValue(0.85);
      feedbackOpacity.setValue(0);

      try {
        const p = await fetchRandomPokemon(diff);
        setPokemon(p);
        setGameState("playing");
      } catch {
        if (attempt < MAX_RETRIES) {
          loadPokemon(diff, attempt + 1);
        } else {
          setGameState("error");
        }
      }
    },
    [difficulty, silhouetteOpacity, revealScale, feedbackOpacity],
  );

  useEffect(() => {
    loadPokemon();
  }, []);

  // Acciones
  const handleDifficultyChange = useCallback(
    (diff: Difficulty) => {
      if (diff === difficulty) return;
      setDifficulty(diff);
      setScore(0);
      setStreak(0);
      loadPokemon(diff);
    },
    [difficulty, loadPokemon],
  );

  const handleSubmit = useCallback(() => {
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
  }, [
    pokemon,
    gameState,
    inputValue,
    score,
    streak,
    record,
    bestStreak,
    animateShake,
    animateReveal,
    saveRecord,
    saveBestStreak,
  ]);

  const handleSkip = useCallback(() => {
    setStreak(0);
    setGameState("wrong");
    setInputValue("");
    animateReveal();
  }, [animateReveal]);

  const handleNext = useCallback(() => {
    loadPokemon();
  }, [loadPokemon]);

  return {
    // Estado
    difficulty,
    pokemon,
    gameState,
    inputValue,
    setInputValue,
    score,
    streak,
    record,
    bestStreak,
    // Animaciones
    silhouetteOpacity,
    revealScale,
    feedbackOpacity,
    shakeAnim,
    // Acciones
    handleDifficultyChange,
    handleSubmit,
    handleSkip,
    handleNext,
  };
}
