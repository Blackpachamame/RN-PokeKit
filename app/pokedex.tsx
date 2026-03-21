import {
  ErrorState,
  LoadingMoreFooter,
  NoResultsState,
  SearchingState,
} from "@/components/EmptyStates/EmptyStates";
import { EndOfListMessage } from "@/components/EndOfListMessage/EndOfListMessage";
import { PokedexResultCounter } from "@/components/PokedexScreen/PokedexResultCounter";
import { createStyles } from "@/components/PokedexScreen/PokedexScreen.styles";
import PokemonCard from "@/components/PokemonCard/PokemonCard";
import { ScreenHeader } from "@/components/ScreenHeader/ScreenHeader";
import SearchBar from "@/components/SearchBar/SearchBar";
import { SkeletonList } from "@/components/Skeletons/SkeletonList";
import { SkeletonTypeFilters } from "@/components/Skeletons/SkeletonTypeFilters";
import { TypeFilters } from "@/components/TypeFilters/TypeFilters";
import { usePokedexData } from "@/hooks/usePokedexData";
import { useThemeColors } from "@/hooks/useThemedStyles";
import { router } from "expo-router";
import { useMemo } from "react";
import { FlatList, Pressable, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Separator = () => <Pressable style={{ height: 16 }} />;

const renderItem = ({ item }: { item: any }) => (
  <Pressable onPress={() => router.push(`/pokemon/${item.id}`)}>
    <PokemonCard pokemon={item} />
  </Pressable>
);

export default function PokedexScreen() {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const {
    dataToRender,
    totalResults,
    currentCount,
    loading,
    loadingMore,
    refreshing,
    error,
    isInitialLoading,
    canLoadMore,
    searchQuery,
    setSearchQuery,
    isSearching,
    selectedTypes,
    handleTypeToggle,
    hasActiveFilters,
    indexLoading,
    handleLoadMore,
    onRefresh,
    refresh,
  } = usePokedexData();

  if (loading && dataToRender.length === 0) {
    return (
      <SafeAreaView style={styles.skeletonContainer} edges={["top"]}>
        <ScreenHeader title="Pokédex" />
        <SearchBar value="" onChangeText={() => {}} />
        <SkeletonTypeFilters />
        <SkeletonList count={8} />
      </SafeAreaView>
    );
  }

  if (error && dataToRender.length === 0) {
    return <ErrorState error={error} onRetry={refresh} />;
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
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
            <ScreenHeader title="Pokédex" />
            <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
            {indexLoading ? (
              <SkeletonTypeFilters />
            ) : (
              <TypeFilters selectedTypes={selectedTypes} onTypeToggle={handleTypeToggle} />
            )}
            {(isSearching || hasActiveFilters) && dataToRender.length > 0 && (
              <PokedexResultCounter
                searchQuery={searchQuery}
                selectedTypes={selectedTypes}
                isSearching={isSearching}
                hasActiveFilters={hasActiveFilters}
                totalResults={totalResults}
                currentCount={currentCount}
              />
            )}
          </>
        }
        ListEmptyComponent={() => {
          if (isInitialLoading) return <SearchingState />;
          if ((isSearching || hasActiveFilters) && !isInitialLoading) return <NoResultsState />;
          return null;
        }}
        ListFooterComponent={() => {
          if (loadingMore) return <LoadingMoreFooter />;
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
    </SafeAreaView>
  );
}
