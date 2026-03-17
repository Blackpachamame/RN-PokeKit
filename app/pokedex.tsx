import {
  ErrorState,
  LoadingMoreFooter,
  NoResultsState,
  SearchingState,
} from "@/components/EmptyStates/EmptyStates";
import { EndOfListMessage } from "@/components/EndOfListMessage/EndOfListMessage";
import PokemonCard from "@/components/PokemonCard/PokemonCard";
import SearchBar from "@/components/SearchBar/SearchBar";
import { SkeletonList } from "@/components/Skeletons/SkeletonList";
import { SkeletonTypeFilters } from "@/components/Skeletons/SkeletonTypeFilters";
import { ThemeToggle } from "@/components/ThemeToggle/ThemeToggle";
import { TypeFilters } from "@/components/TypeFilters/TypeFilters";
import { usePokemonList } from "@/hooks/usePokemonList";
import { usePokemonSearch } from "@/hooks/usePokemonSearch";
import { useThemeColors, useThemedStyles } from "@/hooks/useThemedStyles";
import { useTypeFilter } from "@/hooks/useTypeFilter";
import { fetchPokemonIndex } from "@/services/pokeapi";
import { PokemonListIndex } from "@/types/pokemon";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Index() {
  const [pokemonsIndex, setPokemonsIndex] = useState<PokemonListIndex[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const { pokemons, loading, loadingMore, refreshing, error, hasMore, loadMore, refresh } =
    usePokemonList();

  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    searchLoading,
    isSearching,
    clearSearch,
    loadMoreSearch,
    hasMoreSearch,
    totalSearchResults,
  } = usePokemonSearch(pokemonsIndex);

  const {
    typeResults,
    typeLoading,
    hasActiveFilters,
    indexLoading,
    loadMoreFiltered,
    hasMoreFiltered,
    totalTypeResults,
  } = useTypeFilter(selectedTypes);
  const colors = useThemeColors();
  // Themed styles
  const styles = useThemedStyles((colors) =>
    StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: colors.background,
      },
      skeletonContainer: {
        flex: 1,
        backgroundColor: colors.background,
      },
      listContainer: {
        padding: 16,
        paddingBottom: 32,
      },
      separator: {
        height: 16,
      },
      headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
      },
      resultCounter: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: colors.counterBackground,
        borderRadius: 8,
        marginBottom: 12,
        alignSelf: "flex-start",
      },
      resultCounterText: {
        fontSize: 12,
        fontWeight: "700",
        color: colors.counterText,
        textTransform: "uppercase",
        letterSpacing: 0.5,
      },
    }),
  );

  useEffect(() => {
    const loadIndex = async () => {
      try {
        const data = await fetchPokemonIndex();
        setPokemonsIndex(data);
      } catch (err) {
        console.error(err);
      }
    };
    loadIndex();
  }, []);

  const handleTypeToggle = useCallback((type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  }, []);

  const onRefresh = useCallback(() => {
    clearSearch();
    setSelectedTypes([]);
    refresh();
  }, [clearSearch, refresh]);

  const { dataToRender, totalResults, currentCount } = useMemo(() => {
    let data = [];

    if (isSearching && hasActiveFilters) {
      data = searchResults.filter((pokemon) =>
        pokemon.types.some((type) => selectedTypes.includes(type)),
      );
    } else if (isSearching) {
      data = searchResults;
    } else if (hasActiveFilters) {
      data = typeResults;
    } else {
      data = pokemons;
    }

    const uniqueMap = new Map();
    data.forEach((p) => uniqueMap.set(p.id, p));
    const unique = Array.from(uniqueMap.values());

    return {
      dataToRender: unique,
      totalResults: isSearching
        ? totalSearchResults
        : hasActiveFilters
          ? totalTypeResults
          : unique.length,
      currentCount: unique.length,
    };
  }, [
    isSearching,
    hasActiveFilters,
    searchResults,
    typeResults,
    pokemons,
    selectedTypes,
    totalSearchResults,
    totalTypeResults,
  ]);

  const handleLoadMore = useCallback(() => {
    if (isSearching && hasActiveFilters) return;
    if (isSearching) loadMoreSearch();
    else if (hasActiveFilters) loadMoreFiltered();
    else loadMore();
  }, [isSearching, hasActiveFilters, loadMoreSearch, loadMoreFiltered, loadMore]);

  const canLoadMore = useMemo(() => {
    return isSearching && hasActiveFilters
      ? false
      : isSearching
        ? hasMoreSearch
        : hasActiveFilters
          ? hasMoreFiltered
          : hasMore;
  }, [isSearching, hasActiveFilters, hasMoreSearch, hasMoreFiltered, hasMore]);

  const isLoadingMore = useMemo(() => {
    if (isSearching && hasActiveFilters) return false;
    if (isSearching && searchResults.length > 0) return searchLoading;
    if (hasActiveFilters && typeResults.length > 0) return typeLoading;
    if (pokemons.length > 0) return loadingMore;
    return false;
  }, [
    isSearching,
    hasActiveFilters,
    searchLoading,
    typeLoading,
    loadingMore,
    searchResults,
    typeResults,
    pokemons,
  ]);

  const isInitialLoading = useMemo(() => {
    if (isSearching && searchResults.length === 0) return searchLoading;
    if (hasActiveFilters && typeResults.length === 0) return typeLoading;
    return false;
  }, [isSearching, hasActiveFilters, searchLoading, typeLoading, searchResults, typeResults]);

  // Loading inicial con skeleton
  if (loading && pokemons.length === 0) {
    return (
      <View style={styles.skeletonContainer}>
        <View style={styles.listContainer}>
          {/* Header con toggle */}
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }} />
            <ThemeToggle />
          </View>

          <SearchBar value="" onChangeText={() => {}} />
          <SkeletonTypeFilters />
          <SkeletonList count={8} />
        </View>
      </View>
    );
  }

  if (error && pokemons.length === 0) return <ErrorState error={error} onRetry={refresh} />;

  return (
    <View style={styles.container}>
      <FlatList
        data={dataToRender}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={Separator}
        renderItem={renderItem}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={
          <>
            {/* Header con toggle de tema */}
            <View style={styles.headerRow}>
              <TouchableOpacity
                onPress={() => router.back()}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
                <ChevronLeft size={26} color={colors.text} strokeWidth={2.5} />
              </TouchableOpacity>
              <View style={{ flex: 1 }} />
              <ThemeToggle />
            </View>

            <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
            {indexLoading ? (
              <SkeletonTypeFilters />
            ) : (
              <TypeFilters selectedTypes={selectedTypes} onTypeToggle={handleTypeToggle} />
            )}
            {(isSearching || hasActiveFilters) && dataToRender.length > 0 && (
              <View style={styles.resultCounter}>
                <Text style={styles.resultCounterText}>
                  {isSearching && hasActiveFilters
                    ? `"${searchQuery}" in ${selectedTypes.join(" + ")} • ${totalResults} found`
                    : `${totalResults} found • Showing ${currentCount}`}
                </Text>
              </View>
            )}
          </>
        }
        ListEmptyComponent={() => {
          if (isInitialLoading) return <SearchingState />;
          if ((isSearching || hasActiveFilters) && !isInitialLoading) return <NoResultsState />;
          return null;
        }}
        ListFooterComponent={() => {
          if (isLoadingMore) return <LoadingMoreFooter />;
          if (!canLoadMore && dataToRender.length > 0) return <EndOfListMessage />;
          return null;
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#6390F0"]}
            tintColor="#6390F0"
          />
        }
        removeClippedSubviews
        maxToRenderPerBatch={10}
        windowSize={10}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}

const Separator = () => <View style={{ height: 16 }} />;

const renderItem = ({ item }: { item: any }) => (
  <Pressable onPress={() => router.push(`/pokemon/${item.id}`)}>
    <PokemonCard pokemon={item} />
  </Pressable>
);
