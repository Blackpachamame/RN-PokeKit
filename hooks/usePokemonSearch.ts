import { fetchPokemonByIdLight } from "@/services/pokeapi";
import { PokemonListIndex, PokemonListItem } from "@/types/pokemon";
import { useEffect, useRef, useState } from "react";

const ITEMS_PER_BATCH = 20;

/**
 * Hook personalizado para manejar búsqueda de Pokémon
 * Con infinite scroll y protección contra race conditions
 */
export function usePokemonSearch(pokemonsIndex: PokemonListIndex[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PokemonListItem[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const currentSearchRef = useRef<string>("");
  const filteredIdsRef = useRef<number[]>([]);
  const loadedCountRef = useRef(0); // Ref para rastrear cuántos hemos cargado

  // Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Búsqueda inicial (primeros 20)
  useEffect(() => {
    const queryToSearch = debouncedQuery;
    currentSearchRef.current = queryToSearch;

    if (queryToSearch.trim() === "") {
      setSearchResults([]);
      setSearchLoading(false);
      filteredIdsRef.current = [];
      loadedCountRef.current = 0;
      return;
    }

    const runSearch = async () => {
      setSearchLoading(true);

      try {
        const query = queryToSearch.toLowerCase();

        // Filtrar en el índice (TODOS los resultados)
        const matched = pokemonsIndex.filter(
          (p) => p.name.toLowerCase().includes(query) || p.id.toString().includes(query),
        );

        filteredIdsRef.current = matched.map((p) => p.id);
        loadedCountRef.current = 0; // Reset

        // Cargar solo los primeros 20
        const idsToLoad = filteredIdsRef.current.slice(0, ITEMS_PER_BATCH);

        const results = await Promise.all(
          idsToLoad.map(async (id) => {
            try {
              return await fetchPokemonByIdLight(id);
            } catch (err) {
              console.error(`Error fetching pokemon ${id}:`, err);
              return null;
            }
          }),
        );

        if (currentSearchRef.current === queryToSearch) {
          const validResults = results.filter((r): r is PokemonListItem => r !== null);
          setSearchResults(validResults);
          loadedCountRef.current = validResults.length; // Actualizar ref
          setSearchLoading(false);
        }
      } catch (e) {
        console.error(e);
        if (currentSearchRef.current === queryToSearch) {
          setSearchResults([]);
          loadedCountRef.current = 0;
          setSearchLoading(false);
        }
      }
    };

    runSearch();
  }, [debouncedQuery, pokemonsIndex]);

  // Función para cargar más resultados
  const loadMoreSearch = async () => {
    if (searchLoading) return;

    const currentCount = loadedCountRef.current;

    if (currentCount >= filteredIdsRef.current.length) return;

    setSearchLoading(true);

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

      setSearchResults((prev) => {
        const allResults = [...prev, ...validResults];
        // Eliminamos duplicados por ID antes de guardar
        const uniqueMap = new Map();
        allResults.forEach((p) => uniqueMap.set(p.id, p));
        const unique = Array.from(uniqueMap.values());
        loadedCountRef.current = unique.length; // Mantenemos el ref sincronizado
        return unique;
      });
    } catch (e) {
      console.error(e);
    } finally {
      setSearchLoading(false);
    }
  };

  const hasMoreSearch = loadedCountRef.current < filteredIdsRef.current.length;

  const clearSearch = () => {
    setSearchQuery("");
    currentSearchRef.current = "";
    filteredIdsRef.current = [];
    loadedCountRef.current = 0;
  };

  const isSearching = debouncedQuery.trim().length > 0;

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    searchLoading,
    isSearching,
    clearSearch,
    loadMoreSearch,
    hasMoreSearch,
    totalSearchResults: filteredIdsRef.current.length,
  };
}
