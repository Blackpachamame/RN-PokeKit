import { useThemeColors } from "@/hooks/useThemedStyles";
import { Flame, Trophy } from "lucide-react-native";
import { useMemo } from "react";
import { Text, View } from "react-native";
import { createStyles } from "./GuessGame.styles";

interface GuessStatsBarProps {
  record: number;
  score: number;
  streak: number;
  bestStreak: number;
}

export function GuessStatsBar({ record, score, streak, bestStreak }: GuessStatsBarProps) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <>
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Trophy size={15} color={colors.warning} />
          <Text style={styles.statLabel}>Record</Text>
          <Text style={styles.statValue}>{record}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Score</Text>
          <Text style={[styles.statValue, styles.statValueLarge]}>{score}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Flame size={15} color={streak > 0 ? "#FF6B35" : colors.textTertiary} />
          <Text style={styles.statLabel}>Streak</Text>
          <Text style={[styles.statValue, streak > 0 && styles.streakValue]}>{streak}</Text>
        </View>
      </View>

      {bestStreak > 0 && (
        <View style={styles.bestStreakContainer}>
          <Flame size={13} color="#FF6B35" />
          <Text style={styles.bestStreakText}>Best streak: {bestStreak}</Text>
        </View>
      )}
    </>
  );
}
