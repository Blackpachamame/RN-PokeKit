import { useFavorites } from "@/context/FavoritesContext";
import { PokemonListItem } from "@/types/pokemon";
import { getMultiTypeGradient } from "@/utils/color";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ChevronLeft, Heart } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TypeBadge } from "../TypeBadge/TypeBadge";
import { styles } from "./styles";

type PokemonHeaderProps = {
  id: number;
  name: string;
  image: string;
  types: string[];
  pokemon?: PokemonListItem;
};

function PokemonHeader({ id, name, image, types, pokemon }: PokemonHeaderProps) {
  const formattedNumber = `#${id.toString().padStart(4, "0")}`;
  const gradientColors = getMultiTypeGradient(types);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = pokemon ? isFavorite(pokemon.id) : false;

  return (
    <LinearGradient
      colors={gradientColors}
      style={[styles.container, { paddingTop: insets.top + 12 }]}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}>
      <Image
        source={require("@/assets/images/pokeball2.png")}
        style={styles.backgroundIcon}
        contentFit="contain"
      />

      {/* Fila 1: Back | Número | Favorito */}
      <View style={styles.topRow}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <ChevronLeft size={28} color="#fff" strokeWidth={2.5} />
        </TouchableOpacity>

        <Text style={styles.number}>{formattedNumber}</Text>

        <TouchableOpacity
          onPress={() => pokemon && toggleFavorite(pokemon)}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Heart
            size={24}
            color="#fff"
            fill={favorite ? "#fff" : "transparent"}
            strokeWidth={2.5}
          />
        </TouchableOpacity>
      </View>

      {/* Nombre */}
      <Text numberOfLines={2} ellipsizeMode="tail" style={styles.name}>
        {name}
      </Text>

      {/* Tipos */}
      <View style={styles.types}>
        {types.map((type) => (
          <TypeBadge key={type} type={type} variant="badge" extend={true} />
        ))}
      </View>

      {/* Imagen centrada */}
      <Image source={{ uri: image }} style={styles.image} contentFit="contain" />
    </LinearGradient>
  );
}

export default PokemonHeader;
