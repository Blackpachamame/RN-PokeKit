import { ThemeToggle } from "@/components/ThemeToggle/ThemeToggle";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { router } from "expo-router";
import { BarChart2, Heart, HelpCircle, Search } from "lucide-react-native";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  const styles = useThemedStyles((colors) =>
    StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: insets.top + 8,
        paddingHorizontal: 20,
        paddingBottom: insets.bottom + 16,
      },
      header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 20,
      },
      logoRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
      },
      appName: {
        fontSize: 28,
        fontWeight: "800",
        color: colors.text,
        letterSpacing: -0.5,
      },
      sectionLabel: {
        fontSize: 16,
        color: colors.text,
        marginBottom: 14,
      },
      cardsContainer: {
        flex: 1,
        gap: 14,
      },
      card: {
        backgroundColor: colors.card,
        borderRadius: 20,
        padding: 20,
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        borderWidth: 1,
        borderColor: colors.cardBorder,
      },
      iconBox: {
        width: 52,
        height: 52,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      },
      cardTitle: {
        fontSize: 17,
        fontWeight: "700",
        color: colors.text,
        marginBottom: 3,
      },
      cardDescription: {
        fontSize: 13,
        color: colors.textSecondary,
      },
      comingSoon: {
        marginTop: 6,
        alignSelf: "flex-start",
        backgroundColor: colors.backgroundTertiary,
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 2,
      },
      comingSoonText: {
        fontSize: 10,
        fontWeight: "700",
        color: colors.textTertiary,
        textTransform: "uppercase",
        letterSpacing: 0.5,
      },
    }),
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <Image
            source={require("@/assets/images/splash-icon.png")}
            style={{ width: 36, height: 36 }}
            resizeMode="contain"
          />
          <Text style={styles.appName}>PokéDex</Text>
        </View>
        <ThemeToggle />
      </View>

      <Text style={styles.sectionLabel}>¿Qué vas a explorar hoy?</Text>

      {/* Cards */}
      <View style={styles.cardsContainer}>
        <Pressable style={styles.card} onPress={() => router.push("/pokedex")}>
          <View style={[styles.iconBox, { backgroundColor: "#EEF2FF" }]}>
            <Search size={26} color="#6390F0" strokeWidth={2.5} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Pokédex</Text>
            <Text style={styles.cardDescription}>Explorá los 1025 pokémon</Text>
          </View>
        </Pressable>

        <Pressable style={styles.card} onPress={() => router.push("/favorites")}>
          <View style={[styles.iconBox, { backgroundColor: "#FEF2F2" }]}>
            <Heart size={26} color="#EF4444" strokeWidth={2.5} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Favoritos</Text>
            <Text style={styles.cardDescription}>Tus pokémon guardados</Text>
          </View>
        </Pressable>

        <Pressable style={styles.card} onPress={() => router.push("/guess")}>
          <View style={[styles.iconBox, { backgroundColor: "#FFFBEB" }]}>
            <HelpCircle size={26} color="#F59E0B" strokeWidth={2.5} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>¿Quién es ese Pokémon?</Text>
            <Text style={styles.cardDescription}>Adiviná el pokémon oculto</Text>
          </View>
        </Pressable>

        <Pressable style={styles.card} onPress={() => router.push("/compare")}>
          <View style={[styles.iconBox, { backgroundColor: "#F0FDF4" }]}>
            <BarChart2 size={26} color="#22C55E" strokeWidth={2.5} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Comparar</Text>
            <Text style={styles.cardDescription}>Enfrentá pokémon</Text>
            <View style={styles.comingSoon}>
              <Text style={styles.comingSoonText}>Próximamente</Text>
            </View>
          </View>
        </Pressable>
      </View>
    </View>
  );
}
