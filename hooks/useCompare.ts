import {
  fetchPokemonByIdLight,
  fetchPokemonIndex,
  fetchPokemonStats,
  fetchWeaknessesForTypes,
} from "@/services/pokeapi";
import { PokemonListIndex, PokemonListItem, PokemonStat } from "@/types/pokemon";
import { useEffect, useRef, useState } from "react";

export type CompareSlot = "a" | "b";

export type ComparePokemon = PokemonListItem & {
  weaknesses: string[];
  stats: PokemonStat[];
};

/**
 * Hook para manejar la lógica del comparador de Pokémon.
 * Maneja dos slots independientes con búsqueda, selección y fetch de debilidades.
 */
export function useCompare() {
  const [index, setIndex] = useState<PokemonListIndex[]>([]);
  const [indexLoading, setIndexLoading] = useState(true);

  const [queryA, setQueryA] = useState("");
  const [queryB, setQueryB] = useState("");
  const [resultsA, setResultsA] = useState<PokemonListIndex[]>([]);
  const [resultsB, setResultsB] = useState<PokemonListIndex[]>([]);

  const [pokemonA, setPokemonA] = useState<ComparePokemon | null>(null);
  const [pokemonB, setPokemonB] = useState<ComparePokemon | null>(null);
  const [loadingA, setLoadingA] = useState(false);
  const [loadingB, setLoadingB] = useState(false);

  const debounceA = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debounceB = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cargar índice ligero al montar
  useEffect(() => {
    fetchPokemonIndex()
      .then(setIndex)
      .catch(console.error)
      .finally(() => setIndexLoading(false));
  }, []);

  // Búsqueda con debounce para slot A
  useEffect(() => {
    if (debounceA.current) clearTimeout(debounceA.current);
    if (!queryA.trim()) {
      setResultsA([]);
      return;
    }

    debounceA.current = setTimeout(() => {
      const q = queryA.toLowerCase();
      setResultsA(
        index
          .filter((p) => p.name.toLowerCase().includes(q) || p.id.toString().includes(q))
          .slice(0, 6),
      );
    }, 300);

    return () => {
      if (debounceA.current) clearTimeout(debounceA.current);
    };
  }, [queryA, index]);

  // Búsqueda con debounce para slot B
  useEffect(() => {
    if (debounceB.current) clearTimeout(debounceB.current);
    if (!queryB.trim()) {
      setResultsB([]);
      return;
    }

    debounceB.current = setTimeout(() => {
      const q = queryB.toLowerCase();
      setResultsB(
        index
          .filter((p) => p.name.toLowerCase().includes(q) || p.id.toString().includes(q))
          .slice(0, 6),
      );
    }, 300);

    return () => {
      if (debounceB.current) clearTimeout(debounceB.current);
    };
  }, [queryB, index]);

  const selectPokemon = async (slot: CompareSlot, id: number) => {
    const setLoading = slot === "a" ? setLoadingA : setLoadingB;
    const setPokemon = slot === "a" ? setPokemonA : setPokemonB;

    setLoading(true);
    if (slot === "a") {
      setQueryA("");
      setResultsA([]);
    } else {
      setQueryB("");
      setResultsB([]);
    }

    try {
      const [light, weaknesses, stats] = await Promise.all([
        fetchPokemonByIdLight(id),
        fetchWeaknessesForTypes(id),
        fetchPokemonStats(id),
      ]);

      if (light) setPokemon({ ...light, weaknesses, stats });
    } catch (err) {
      console.error(`Error selecting pokemon ${id}:`, err);
    } finally {
      setLoading(false);
    }
  };

  const clearSlot = (slot: CompareSlot) => {
    if (slot === "a") {
      setPokemonA(null);
      setQueryA("");
      setResultsA([]);
    } else {
      setPokemonB(null);
      setQueryB("");
      setResultsB([]);
    }
  };

  return {
    // Búsqueda
    queryA,
    setQueryA,
    queryB,
    setQueryB,
    resultsA,
    resultsB,
    indexLoading,
    // Pokémon seleccionados
    pokemonA,
    pokemonB,
    loadingA,
    loadingB,
    // Acciones
    selectPokemon,
    clearSlot,
  };
}
