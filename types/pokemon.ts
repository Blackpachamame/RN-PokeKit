export type PokemonListItem = {
  id: number;
  name: string;
  image: string;
  types: string[];
};

export type PokemonListIndex = {
  id: number;
  name: string;
  image?: string;
};

export type PokemonStat = {
  name: string;
  value: number;
};

export interface PokemonMove {
  name: string;
  type: string;
  category: "physical" | "special" | "status";
  power: number | null;
  accuracy: number | null;
  pp: number;
  learnMethod: string;
  levelLearnedAt: number | null;
}

export type EvolutionChain = {
  id: number;
  name: string;
  image: string;
  minLevel: number | null;
  method?: string;
  item?: string;
};

export type PokemonDetails = {
  id: number;
  name: string;
  image: string;
  types: string[];
  height: number;
  weight: number;
  abilities: string[];
  stats: PokemonStat[];
  description: string;
  category: string;
  weaknesses: string[];
  evolutionChain: EvolutionChain[];
  moves: PokemonMove[];
};

export type PokemonType =
  | "normal"
  | "fire"
  | "water"
  | "electric"
  | "grass"
  | "ice"
  | "fighting"
  | "poison"
  | "ground"
  | "flying"
  | "psychic"
  | "bug"
  | "rock"
  | "ghost"
  | "dragon"
  | "dark"
  | "steel"
  | "fairy";

export type PokemonTab = "about" | "stats" | "moves";
