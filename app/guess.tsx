import { GuessDifficultySelector } from "@/components/GuessGame/GuessDifficultySelector";
import { createStyles } from "@/components/GuessGame/GuessGame.styles";
import { GuessInput } from "@/components/GuessGame/GuessInput";
import { GuessPokemonSilhouette } from "@/components/GuessGame/GuessPokemonSilhouette";
import { GuessStatsBar } from "@/components/GuessGame/GuessStatsBar";
import { ScreenHeader } from "@/components/ScreenHeader/ScreenHeader";
import { useGuessGame } from "@/hooks/useGuessGame";
import { useThemeColors } from "@/hooks/useThemedStyles";
import { useMemo } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GuessScreen() {
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
        <ScreenHeader title="Who's That Pokémon?" />

        <GuessStatsBar record={record} score={score} streak={streak} bestStreak={bestStreak} />

        <GuessDifficultySelector difficulty={difficulty} onSelect={handleDifficultyChange} />

        <GuessPokemonSilhouette
          pokemon={pokemon}
          gameState={gameState}
          silhouetteOpacity={silhouetteOpacity}
          revealScale={revealScale}
          feedbackOpacity={feedbackOpacity}
          inputValue={inputValue}
          onRetry={handleNext}
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
