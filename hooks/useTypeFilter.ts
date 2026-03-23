import { fetchPokemonByIdLight, fetchPokemonsByType } from "@/services/pokeapi";
import { PokemonListIndex, PokemonListItem } from "@/types/pokemon";
import { POKEMON_TYPE_IDS } from "@/utils/pokemonTypes";
import { useEffect, useRef, useState } from "react";

const ITEMS_PER_BATCH = 20;

/**
 * Hook para filtrado por tipo con infinite scroll
 */
export function useTypeFilter(selectedTypes: string[]) {
  const [typeIndex, setTypeIndex] = useState<Record<string, PokemonListIndex[]>>({});
  const [typeResults, setTypeResults] = useState<PokemonListItem[]>([]);
  const [typeLoading, setTypeLoading] = useState(false);
  const [indexLoading, setIndexLoading] = useState(false);

  const hasActiveFilters = selectedTypes.length > 0;
  const filteredIdsRef = useRef<number[]>([]);
  const isLoadingRef = useRef(false);
  const loadedCountRef = useRef(0);

  // Cargar índice completo la primera vez
  useEffect(() => {
    if (Object.keys(typeIndex).length > 0) return;

    const loadTypeIndex = async () => {
      setIndexLoading(true);
      try {
        const typePromises = Object.entries(POKEMON_TYPE_IDS).map(async ([typeName, typeId]) => {
          try {
            const pokemonList = await fetchPokemonsByType(typeId);
            return { typeName, pokemonList };
          } catch (err) {
            console.error(`Error loading type ${typeName}:`, err);
            return { typeName, pokemonList: [] };
          }
        });

        const results = await Promise.all(typePromises);

        const index = results.reduce(
          (acc, { typeName, pokemonList }) => {
            acc[typeName] = pokemonList;
            return acc;
          },
          {} as Record<string, PokemonListIndex[]>,
        );

        setTypeIndex(index);
      } catch (err) {
        console.error("Error loading type index:", err);
      } finally {
        setIndexLoading(false);
      }
    };

    const timer = setTimeout(loadTypeIndex, 500);
    return () => clearTimeout(timer);
  }, []);

  // Cargar primeros 20 cuando cambian los tipos seleccionados
  useEffect(() => {
    if (selectedTypes.length === 0) {
      setTypeResults([]);
      filteredIdsRef.current = [];
      loadedCountRef.current = 0;
      return;
    }

    if (Object.keys(typeIndex).length === 0) return;

    const loadFilteredPokemon = async () => {
      setTypeLoading(true);

      try {
        const combinedIds = new Set<number>();
        selectedTypes.forEach((type) => {
          const pokemonList = typeIndex[type] || [];
          pokemonList.forEach((p) => combinedIds.add(p.id));
        });

        const sortedIds = Array.from(combinedIds).sort((a, b) => a - b);
        filteredIdsRef.current = sortedIds;
        loadedCountRef.current = 0;

        const firstBatch = sortedIds.slice(0, ITEMS_PER_BATCH);

        const results = await Promise.all(
          firstBatch.map(async (id) => {
            try {
              return await fetchPokemonByIdLight(id);
            } catch (err) {
              console.error(`Error fetching pokemon ${id}:`, err);
              return null;
            }
          }),
        );

        const validResults = results.filter((r): r is PokemonListItem => r !== null);
        setTypeResults(validResults);
        loadedCountRef.current = validResults.length;
      } catch (e) {
        console.error(e);
        setTypeResults([]);
        loadedCountRef.current = 0;
      } finally {
        setTypeLoading(false);
      }
    };

    loadFilteredPokemon();
  }, [selectedTypes, typeIndex]);

  // Función para cargar más resultados
  const loadMoreFiltered = async () => {
    if (isLoadingRef.current || typeLoading) return;

    const currentCount = loadedCountRef.current;

    if (currentCount >= filteredIdsRef.current.length) return;

    isLoadingRef.current = true;
    setTypeLoading(true);

    try {
      const nextIds = filteredIdsRef.current.slice(currentCount, currentCount + ITEMS_PER_BATCH);

      const results = await Promise.all(
        nextIds.map(async (id) => {
          try {
            return await fetchPokemonByIdLight(id);
          } catch (err) {
            console.error(`Error fetching pokemon ${id}:`, err);
            return null;
          }
        }),
      );

      const validResults = results.filter((r): r is PokemonListItem => r !== null);

      setTypeResults((prev) => {
        const allPokemon = [...prev, ...validResults];
        const uniqueMap = new Map();
        allPokemon.forEach((p) => uniqueMap.set(p.id, p));
        const unique = Array.from(uniqueMap.values());
        loadedCountRef.current = unique.length;
        return unique;
      });
    } catch (e) {
      console.error(e);
    } finally {
      setTypeLoading(false);
      isLoadingRef.current = false;
    }
  };

  const hasMoreFiltered = loadedCountRef.current < filteredIdsRef.current.length;

  return {
    typeResults,
    typeLoading,
    hasActiveFilters,
    indexLoading,
    loadMoreFiltered,
    hasMoreFiltered,
    totalTypeResults: filteredIdsRef.current.length,
  };
}
