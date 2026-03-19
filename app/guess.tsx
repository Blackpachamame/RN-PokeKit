import { GuessDifficultySelector } from "@/components/GuessGame/GuessDifficultySelector";
import { createStyles } from "@/components/GuessGame/GuessGame.styles";
import { GuessInput } from "@/components/GuessGame/GuessInput";
import { GuessPokemonSilhouette } from "@/components/GuessGame/GuessPokemonSilhouette";
import { GuessStatsBar } from "@/components/GuessGame/GuessStatsBar";
import { useGuessGame } from "@/hooks/useGuessGame";
import { useThemeColors } from "@/hooks/useThemedStyles";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useMemo } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GuessScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const {
    difficulty,
    pokemon,
    gameState,
    inputValue,
    setInputValue,
    score,
    streak,
    record,
    bestStreak,
    silhouetteOpacity,
    revealScale,
    feedbackOpacity,
    shakeAnim,
    handleDifficultyChange,
    handleSubmit,
    handleSkip,
    handleNext,
  } = useGuessGame();

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
          <Text style={styles.headerTitle}>Who&apos;s That Pokémon?</Text>
          <View style={styles.headerRight} />
        </View>

        <GuessStatsBar record={record} score={score} streak={streak} bestStreak={bestStreak} />

        <GuessDifficultySelector difficulty={difficulty} onSelect={handleDifficultyChange} />

        <GuessPokemonSilhouette
          pokemon={pokemon}
          gameState={gameState}
          silhouetteOpacity={silhouetteOpacity}
          revealScale={revealScale}
          feedbackOpacity={feedbackOpacity}
          inputValue={inputValue}
        />

        <GuessInput
          gameState={gameState}
          inputValue={inputValue}
          onChangeText={setInputValue}
          onSubmit={handleSubmit}
          onSkip={handleSkip}
          onNext={handleNext}
          shakeAnim={shakeAnim}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
