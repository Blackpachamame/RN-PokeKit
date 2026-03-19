import { GameState } from "@/hooks/useGuessGame";
import { useThemeColors } from "@/hooks/useThemedStyles";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronRight } from "lucide-react-native";
import { useMemo, useRef } from "react";
import { Animated, Text, TextInput, TouchableOpacity, View } from "react-native";
import { createStyles } from "./GuessGame.styles";

interface GuessInputProps {
  gameState: GameState;
  inputValue: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  onSkip: () => void;
  onNext: () => void;
  shakeAnim: Animated.Value;
}

export function GuessInput({
  gameState,
  inputValue,
  onChangeText,
  onSubmit,
  onSkip,
  onNext,
  shakeAnim,
}: GuessInputProps) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const inputRef = useRef<TextInput>(null);

  const isRevealed = gameState === "correct" || gameState === "wrong";
  const isDisabled = !inputValue.trim() || gameState !== "playing";

  if (isRevealed) {
    return (
      <View style={styles.inputSection}>
        <TouchableOpacity style={styles.nextBtn} onPress={onNext} activeOpacity={0.8}>
          <LinearGradient
            colors={gameState === "correct" ? ["#4CAF50", "#388E3C"] : ["#EF5350", "#CC3333"]}
            style={styles.nextBtnGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}>
            <Text style={styles.nextBtnText}>
              {gameState === "correct" ? "Next! 🎉" : "Try again"}
            </Text>
            <ChevronRight size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.inputSection}>
      <Animated.View style={[styles.inputWrapper, { transform: [{ translateX: shakeAnim }] }]}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={inputValue}
          onChangeText={onChangeText}
          placeholder="Type the name…"
          placeholderTextColor={colors.textTertiary}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="done"
          onSubmitEditing={onSubmit}
          editable={gameState === "playing"}
        />
      </Animated.View>

      <TouchableOpacity
        style={[styles.submitBtn, isDisabled && styles.submitBtnDisabled]}
        onPress={onSubmit}
        disabled={isDisabled}
        activeOpacity={0.8}>
        <LinearGradient
          colors={["#EF5350", "#CC3333"]}
          style={styles.submitBtnGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}>
          <Text style={styles.submitBtnText}>That&apos;s it!</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity style={styles.skipBtn} onPress={onSkip} activeOpacity={0.6}>
        <Text style={styles.skipBtnText}>I don&apos;t know, reveal</Text>
      </TouchableOpacity>
    </View>
  );
}
