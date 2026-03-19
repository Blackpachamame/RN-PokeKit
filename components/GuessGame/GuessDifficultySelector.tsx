import { Difficulty } from "@/hooks/useGuessGame";
import { useThemeColors } from "@/hooks/useThemedStyles";
import { useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { createStyles } from "./GuessGame.styles";

interface GuessDifficultySelectorProps {
  difficulty: Difficulty;
  onSelect: (diff: Difficulty) => void;
}

export function GuessDifficultySelector({ difficulty, onSelect }: GuessDifficultySelectorProps) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.difficultyContainer}>
      <TouchableOpacity
        style={[styles.diffBtn, difficulty === "easy" && styles.diffBtnActive]}
        onPress={() => onSelect("easy")}
        activeOpacity={0.7}>
        <Text style={styles.diffBtnEmoji}>😊</Text>
        <Text style={[styles.diffBtnText, difficulty === "easy" && styles.diffBtnTextActive]}>
          Easy
        </Text>
        <Text style={[styles.diffBtnSub, difficulty === "easy" && styles.diffBtnSubActive]}>
          Gen 1 · 151
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.diffBtn, difficulty === "hard" && styles.diffBtnActive]}
        onPress={() => onSelect("hard")}
        activeOpacity={0.7}>
        <Text style={styles.diffBtnEmoji}>💀</Text>
        <Text style={[styles.diffBtnText, difficulty === "hard" && styles.diffBtnTextActive]}>
          Hard
        </Text>
        <Text style={[styles.diffBtnSub, difficulty === "hard" && styles.diffBtnSubActive]}>
          All · 1025
        </Text>
      </TouchableOpacity>
    </View>
  );
}
