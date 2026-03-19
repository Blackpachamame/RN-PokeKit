import axios from "axios";
import { EvolutionChain, PokemonDetails, PokemonListItem, PokemonMove } from "../types/pokemon";

const api = axios.create({
  baseURL: "https://pokeapi.co/api/v2",
});

/**
 * Lista paginada CON tipos (para mostrar)
 * Hace N requests en paralelo pero trae data completa para cards
 */
export async function fetchPokemonList(
  limit: number = 20,
  offset: number = 0,
): Promise<PokemonListItem[]> {
  try {
    const listResponse = await api.get(`/pokemon?limit=${limit}&offset=${offset}`);

    const pokemonDetails = await Promise.all(
      listResponse.data.results.map(async (pokemon: any) => {
        try {
          const detailResponse = await api.get(pokemon.url);
          const data = detailResponse.data;
          const displayName = data.name.replace(/-/g, " ");

          return {
            id: data.id,
            name: displayName,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`,
            types: data.types.map((t: any) => t.type.name),
          };
        } catch (err) {
          console.error(`Error fetching pokemon:`, err);
          return null;
        }
      }),
    );

    return pokemonDetails.filter((p): p is PokemonListItem => p !== null);
  } catch (error) {
    console.error("Error fetching pokemon list:", error);
    throw new Error("Failed to fetch Pokémon list");
  }
}

/**
 * Índice ligero (para búsqueda/filtros)
 */
export async function fetchPokemonIndex(): Promise<{ id: number; name: string; image: string }[]> {
  try {
    const response = await api.get(`/pokemon?limit=1025&offset=0`);

    return response.data.results.map((pokemon: any) => {
      const pokemonId = parseInt(pokemon.url.split("/").filter(Boolean).pop() || "0");
      const displayName = pokemon.name.replace(/-/g, " ");

      return {
        id: pokemonId,
        name: displayName,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`,
      };
    });
  } catch (error) {
    console.error("Error fetching pokemon index:", error);
    throw new Error("Failed to fetch Pokémon index");
  }
}

/**
 * Índice por tipo (para filtros)
 * Retorna solo id y name (ligero)
 */
export async function fetchPokemonsByType(typeId: number): Promise<{ id: number; name: string }[]> {
  try {
    const response = await api.get(`/type/${typeId}`);

    const pokemonList = response.data.pokemon
      .map((entry: any) => {
        const url = entry.pokemon.url;
        const pokemonId = parseInt(url.split("/").filter(Boolean).pop() || "0");
        const displayName = entry.pokemon.name.replace(/-/g, " ");

        return {
          id: pokemonId,
          name: displayName,
        };
      })
      .filter((p: any) => p.id <= 1025)
      .sort((a: any, b: any) => a.id - b.id);

    return pokemonList;
  } catch (error) {
    console.error(`Error fetching pokemon for type ${typeId}:`, error);
    throw new Error(`Failed to fetch Pokémon of type ${typeId}`);
  }
}

/**
 * Fetch un Pokémon específico por ID (versión ligera)
 * Usado para búsqueda y filtros por tipo
 */
export async function fetchPokemonByIdLight(id: number): Promise<PokemonListItem | null> {
  try {
    const response = await api.get(`/pokemon/${id}`);
    const data = response.data;

    return {
      id: data.id,
      name: data.name.replace(/-/g, " "),
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
      types: data.types.map((t: any) => t.type.name),
    };
  } catch (error) {
    console.error(`Error fetching pokemon ${id}:`, error);
    return null;
  }
}

export async function fetchPokemonById(id: number): Promise<PokemonDetails> {
  try {
    const response = await api.get(`/pokemon/${id}`);
    const data = response.data;

    const speciesResponse = await api.get(`/pokemon-species/${id}`);
    const speciesData = speciesResponse.data;

    const flavorTextEntry = speciesData.flavor_text_entries.find(
      (entry: any) => entry.language.name === "en",
    );
    const displayName = data.name.replace(/-/g, " ");
    const description =
      flavorTextEntry?.flavor_text
        .replace(/[\n\f\r]/g, " ")
        .replace(/\s\s+/g, " ")
        .trim() || "";

    const genusEntry = speciesData.genera.find((genus: any) => genus.language.name === "en");
    const category = genusEntry?.genus || "";

    const weaknesses = await fetchWeaknesses(data.types.map((t: any) => t.type.name));
    const evolutionChain = await fetchEvolutionChain(speciesData.evolution_chain.url);
    const moves = await fetchMoves(data.moves);

    return {
      id: data.id,
      name: displayName,
      image: data.sprites.other["official-artwork"].front_default,
      types: data.types.map((t: any) => t.type.name),
      height: data.height,
      weight: data.weight,
      abilities: data.abilities.map((a: any) => a.ability.name),
      stats: data.stats.map((stat: any) => ({
        name: stat.stat.name,
        value: stat.base_stat,
      })),
      description,
      category,
      weaknesses,
      evolutionChain,
      moves,
    };
  } catch (error) {
    console.error(`Error fetching pokemon ${id}:`, error);
    throw new Error(`Failed to fetch Pokémon #${id}`);
  }
}

/**
 * Pokémon aleatorio para el juego "Who's That Pokémon?"
 * easy: Gen 1 (IDs 1–151) / hard: todos (IDs 1–1025)
 */
export async function fetchRandomPokemon(difficulty: "easy" | "hard"): Promise<PokemonListItem> {
  const max = difficulty === "easy" ? 151 : 1025;
  const id = Math.floor(Math.random() * max) + 1;

  const response = await api.get(`/pokemon/${id}`);
  const data = response.data;

  return {
    id,
    name: data.name,
    image: data.sprites.other["official-artwork"].front_default ?? data.sprites.front_default,
    types: data.types.map((t: any) => t.type.name) as string[],
  };
}

async function fetchWeaknesses(types: string[]): Promise<string[]> {
  try {
    const weaknessesSet = new Set<string>();

    for (const typeName of types) {
      const typeResponse = await api.get(`/type/${typeName}`);
      const damageRelations = typeResponse.data.damage_relations;

      damageRelations.double_damage_from.forEach((type: any) => {
        weaknessesSet.add(type.name);
      });
    }

    return Array.from(weaknessesSet);
  } catch (error) {
    console.error("Error fetching weaknesses:", error);
    return [];
  }
}

async function fetchEvolutionChain(evolutionChainUrl: string): Promise<EvolutionChain[]> {
  try {
    const response = await axios.get(evolutionChainUrl);
    const chain = response.data.chain;

    const evolutions: EvolutionChain[] = [];

    const processChain = async (chainLink: any, level: number = 0) => {
      const speciesUrl = chainLink.species.url;
      const speciesId = parseInt(speciesUrl.split("/").filter(Boolean).pop() || "0");

      const pokemonResponse = await api.get(`/pokemon/${speciesId}`);
      const pokemonData = pokemonResponse.data;

      const evolutionDetails = chainLink.evolution_details[0];
      const minLevel = evolutionDetails?.min_level || null;

      evolutions.push({
        id: speciesId,
        name: chainLink.species.name,
        image: pokemonData.sprites.other["official-artwork"].front_default,
        minLevel,
      });

      if (chainLink.evolves_to && chainLink.evolves_to.length > 0) {
        for (const evolution of chainLink.evolves_to) {
          await processChain(evolution, level + 1);
        }
      }
    };

    await processChain(chain);
    return evolutions;
  } catch (error) {
    console.error("Error fetching evolution chain:", error);
    return [];
  }
}

async function fetchMoves(movesData: any[]): Promise<PokemonMove[]> {
  try {
    const levelUpMoves = movesData
      .filter((m: any) =>
        m.version_group_details.some((v: any) => v.move_learn_method.name === "level-up"),
      )
      .slice(0, 20);

    const movesPromises = levelUpMoves.map(async (moveData: any) => {
      try {
        const moveResponse = await api.get(moveData.move.url);
        const move = moveResponse.data;

        const versionDetail = moveData.version_group_details.find(
          (v: any) => v.move_learn_method.name === "level-up",
        );

        return {
          name: move.name,
          type: move.type.name,
          category: move.damage_class.name,
          power: move.power,
          accuracy: move.accuracy,
          pp: move.pp,
          learnMethod: versionDetail?.move_learn_method.name || "level-up",
          levelLearnedAt: versionDetail?.level_learned_at || null,
        };
      } catch (err) {
        console.error(`Error fetching move details:`, err);
        return null;
      }
    });

    const moves = await Promise.all(movesPromises);

    return moves
      .filter((m): m is PokemonMove => m !== null)
      .sort((a, b) => (a.levelLearnedAt || 0) - (b.levelLearnedAt || 0));
  } catch (error) {
    console.error("Error fetching moves:", error);
    return [];
  }
}
