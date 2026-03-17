import PokemonCard from "@/components/PokemonCard/PokemonCard";
import { ThemeToggle } from "@/components/ThemeToggle/ThemeToggle";
import { useFavorites } from "@/context/FavoritesContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { router } from "expo-router";
import { ChevronLeft, Heart } from "lucide-react-native";
import { FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  const { favorites } = useFavorites();

  const styles = useThemedStyles((colors) =>
    StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: colors.background,
      },
      header: {
        flexDirection: "row",
        alignItems: "center",
        paddingTop: insets.top + 12,
        paddingBottom: 12,
        paddingHorizontal: 16,
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: colors.background,
      },
      headerTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: colors.text,
        flex: 1,
      },
      counterRow: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      },
      counterText: {
        fontSize: 13,
        color: colors.textSecondary,
        fontWeight: "600",
      },
      listContainer: {
        padding: 16,
        paddingBottom: 32,
      },
      separator: {
        height: 16,
      },
      emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
        gap: 12,
      },
      emptyTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.text,
      },
      emptyDescription: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: "center",
        lineHeight: 22,
      },
    }),
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <ChevronLeft size={26} color={styles.headerTitle.color} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Favoritos</Text>
        <ThemeToggle />
      </View>

      {/* Contador */}
      {favorites.length > 0 && (
        <View style={styles.counterRow}>
          <Text style={styles.counterText}>
            {favorites.length} {favorites.length === 1 ? "pokémon guardado" : "pokémon guardados"}
          </Text>
        </View>
      )}

      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Heart size={48} color="#FFF" strokeWidth={1.5} />
          <Text style={styles.emptyTitle}>Sin favoritos aún</Text>
          <Text style={styles.emptyDescription}>
            Tocá el corazón en cualquier pokémon para guardarlo acá.
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <Pressable onPress={() => router.push(`/pokemon/${item.id}`)}>
              <PokemonCard pokemon={item} />
            </Pressable>
          )}
        />
      )}
    </View>
  );
}
