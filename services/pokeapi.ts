import axios from "axios";
import {
  EvolutionChain,
  PokemonDetails,
  PokemonListItem,
  PokemonMove,
  PokemonStat,
} from "../types/pokemon";

const api = axios.create({
  baseURL: "https://pokeapi.co/api/v2",
});

/**
 * Obtiene una página de Pokémon con todos sus datos necesarios para las cards.
 * Hace un request inicial para obtener la lista paginada y luego N requests
 * en paralelo para traer tipos e imagen de cada Pokémon.
 *
 * @param limit - Cantidad de Pokémon a traer (default: 20)
 * @param offset - Desde qué posición empezar (default: 0)
 * @returns Lista de Pokémon con id, name, image y types
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
 * Obtiene el índice completo de los 1025 Pokémon en una sola request.
 * Versión ligera: solo trae id, name e image (sin tipos).
 * Usado como fuente de datos para búsqueda y filtros sin hacer requests adicionales.
 *
 * @returns Lista completa de Pokémon con id, name e image
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
 * Obtiene todos los Pokémon que pertenecen a un tipo específico.
 * Versión ligera: solo trae id y name, filtra hasta el 1025 y ordena por id.
 * Usado por useTypeFilter para construir el índice de filtrado por tipo.
 *
 * @param typeId - ID numérico del tipo (ver POKEMON_TYPE_IDS en pokemonTypes.ts)
 * @returns Lista de Pokémon del tipo con id y name, ordenada por id
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
 * Obtiene los datos básicos de un Pokémon por su ID.
 * Versión ligera: solo trae id, name, image y types.
 * Usado por usePokemonSearch y useTypeFilter para hidratar resultados paginados.
 *
 * @param id - ID del Pokémon
 * @returns PokemonListItem o null si ocurre un error
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

/**
 * Obtiene todos los datos de un Pokémon para la pantalla de detalle.
 * Hace múltiples requests en secuencia y paralelo:
 *   1. Datos base del Pokémon
 *   2. Datos de la especie (descripción, categoría, cadena evolutiva)
 *   3. En paralelo: debilidades, cadena evolutiva y movimientos
 *
 * @param id - ID del Pokémon
 * @returns PokemonDetails completo
 * @throws Error si el fetch principal falla
 */
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
 * Obtiene un Pokémon aleatorio para el juego "Who's That Pokémon?".
 * El rango de IDs depende de la dificultad seleccionada.
 *
 * @param difficulty - "easy" limita a Gen 1 (IDs 1-151), "hard" incluye todos (IDs 1-1025)
 * @returns PokemonListItem con los datos necesarios para mostrar la silueta
 * @throws Error si el fetch falla (el hook maneja reintentos)
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

/**
 * Obtiene las debilidades de un Pokémon a partir de sus tipos.
 * Hace los requests en paralelo — un Pokémon tiene máximo 2 tipos.
 * Usa un Set para eliminar duplicados cuando ambos tipos comparten debilidades.
 *
 * @param types - Array de nombres de tipos (ej: ["fire", "flying"])
 * @returns Array de nombres de tipos que hacen doble daño
 */
async function fetchWeaknesses(types: string[]): Promise<string[]> {
  try {
    const responses = await Promise.all(types.map((typeName) => api.get(`/type/${typeName}`)));

    const weaknessesSet = new Set<string>();
    responses.forEach((typeResponse) => {
      typeResponse.data.damage_relations.double_damage_from.forEach((type: any) => {
        weaknessesSet.add(type.name);
      });
    });

    return Array.from(weaknessesSet);
  } catch (error) {
    console.error("Error fetching weaknesses:", error);
    return [];
  }
}

/**
 * Construye la cadena evolutiva completa de un Pokémon de forma recursiva.
 * Las ramas del mismo nivel se resuelven en paralelo con Promise.all,
 * lo que mejora el rendimiento en cadenas ramificadas (Eevee, Tyrogue, etc).
 *
 * @param evolutionChainUrl - URL completa del endpoint de cadena evolutiva
 * @returns Array de EvolutionChain ordenado por aparición en la cadena
 */
async function fetchEvolutionChain(evolutionChainUrl: string): Promise<EvolutionChain[]> {
  try {
    const response = await axios.get(evolutionChainUrl);
    const chain = response.data.chain;

    const evolutions: EvolutionChain[] = [];

    const processChain = async (chainLink: any) => {
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

      if (chainLink.evolves_to?.length > 0) {
        await Promise.all(chainLink.evolves_to.map((evo: any) => processChain(evo)));
      }
    };

    await processChain(chain);
    return evolutions;
  } catch (error) {
    console.error("Error fetching evolution chain:", error);
    return [];
  }
}

/**
 * Obtiene los movimientos aprendidos por nivel de un Pokémon.
 * Filtra solo los movimientos de tipo "level-up" y limita a los primeros 20
 * para evitar tiempos de carga excesivos. Los fetches de detalle van en paralelo.
 * El resultado se ordena por nivel de aprendizaje ascendente.
 *
 * @param movesData - Array de movimientos raw de la API
 * @returns Array de PokemonMove ordenado por levelLearnedAt
 */
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

/**
 * Versión pública de fetchWeaknesses que recibe el ID del Pokémon.
 * Hace un request extra para obtener los tipos antes de calcular debilidades.
 * Usada por el comparador (useCompare) para obtener debilidades de cada slot.
 *
 * @param pokemonId - ID del Pokémon
 * @returns Array de nombres de tipos que hacen doble daño, o [] si falla
 */
export async function fetchWeaknessesForTypes(pokemonId: number): Promise<string[]> {
  try {
    const response = await api.get(`/pokemon/${pokemonId}`);
    const types: string[] = response.data.types.map((t: any) => t.type.name);
    return fetchWeaknesses(types);
  } catch {
    return [];
  }
}

/**
 * Obtiene las estadísticas base de un Pokémon por su ID.
 * Usado por el comparador (useCompare) para mostrar las barras de stats.
 *
 * @param id - ID del Pokémon
 * @returns Array de PokemonStat con name y value, o [] si falla
 */
export async function fetchPokemonStats(id: number): Promise<PokemonStat[]> {
  try {
    const response = await api.get(`/pokemon/${id}`);
    return response.data.stats.map((s: any) => ({
      name: s.stat.name,
      value: s.base_stat,
    }));
  } catch {
    return [];
  }
}
