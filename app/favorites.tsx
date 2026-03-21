import { FavoritesCounter } from "@/components/FavoritesScreen/FavoritesCounter";
import { FavoritesEmpty } from "@/components/FavoritesScreen/FavoritesEmpty";
import PokemonCard from "@/components/PokemonCard/PokemonCard";
import { ScreenHeader } from "@/components/ScreenHeader/ScreenHeader";
import { useFavorites } from "@/context/FavoritesContext";
import { useThemeColors } from "@/hooks/useThemedStyles";
import { SPACING } from "@/utils/constants";
import { router } from "expo-router";
import { useMemo } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FavoritesScreen() {
  const { favorites } = useFavorites();
  const colors = useThemeColors();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: SPACING },
        listContent: { paddingBottom: 32 },
      }),
    [colors],
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScreenHeader title="Favorites" />

      {favorites.length > 0 && <FavoritesCounter count={favorites.length} />}

      {favorites.length === 0 ? (
        <FavoritesEmpty />
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
          renderItem={({ item }) => (
            <Pressable onPress={() => router.push(`/pokemon/${item.id}`)}>
              <PokemonCard pokemon={item} />
            </Pressable>
          )}
        />
      )}
    </SafeAreaView>
  );
}
