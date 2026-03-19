import { PokemonListItem } from "@/types/pokemon";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";

const FAVORITES_STORAGE_KEY = "@pokedex_favorites";

type FavoritesContextType = {
  favorites: PokemonListItem[];
  isFavorite: (id: number) => boolean;
  toggleFavorite: (pokemon: PokemonListItem) => void;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<PokemonListItem[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const saved = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      if (saved) setFavorites(JSON.parse(saved));
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  const saveFavorites = async (newFavorites: PokemonListItem[]) => {
    try {
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavorites));
    } catch (error) {
      console.error("Error saving favorites:", error);
    }
  };

  const toggleFavorite = useCallback((pokemon: PokemonListItem) => {
    setFavorites((prev) => {
      const exists = prev.some((p) => p.id === pokemon.id);
      const updated = exists ? prev.filter((p) => p.id !== pokemon.id) : [...prev, pokemon];
      saveFavorites(updated);
      return updated;
    });
  }, []);

  const isFavorite = useCallback((id: number) => favorites.some((p) => p.id === id), [favorites]);

  return (
    <FavoritesContext value={{ favorites, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites must be used within FavoritesProvider");
  return context;
}
