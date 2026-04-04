import { HomeCard } from "@/components/HomeScreen/HomeCard";
import { HomeHeader } from "@/components/HomeScreen/HomeHeader";
import { createStyles } from "@/components/HomeScreen/HomeScreen.styles";
import { useThemeColors } from "@/hooks/useThemedStyles";
import { router } from "expo-router";
import { BarChart2, Heart, HelpCircle, Search } from "lucide-react-native";
import { useMemo } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <HomeHeader />

      <Text style={styles.sectionLabel}>What will you explore today?</Text>

      <View style={styles.cardsContainer}>
        <HomeCard
          title="Pokédex"
          description="Explore all 1025 Pokémon"
          icon={Search}
          iconColor="#6390F0"
          iconBackground="#EEF2FF"
          onPress={() => router.push("/pokedex")}
        />
        <HomeCard
          title="Favorites"
          description="Your saved Pokémon"
          icon={Heart}
          iconColor="#EF4444"
          iconBackground="#FEF2F2"
          onPress={() => router.push("/favorites")}
        />
        <HomeCard
          title="Who's That Pokémon?"
          description="Guess the hidden Pokémon"
          icon={HelpCircle}
          iconColor="#F59E0B"
          iconBackground="#FFFBEB"
          onPress={() => router.push("/guess")}
        />
        <HomeCard
          title="Compare"
          description="Battle your Pokémon"
          icon={BarChart2}
          iconColor="#22C55E"
          iconBackground="#F0FDF4"
          onPress={() => router.push("/compare")}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Blackpachamame © 2026</Text>
      </View>
    </SafeAreaView>
  );
}
