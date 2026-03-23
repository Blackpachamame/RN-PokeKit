import { useFavorites } from "@/context/FavoritesContext";
import { useThemeColors } from "@/hooks/useThemedStyles";
import { PokemonListItem } from "@/types/pokemon";
import { getMultiTypeGradient } from "@/utils/color";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Heart } from "lucide-react-native";
import { memo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { TypeBadge } from "../TypeBadge/TypeBadge";
import { styles } from "./styles";

type Props = {
  pokemon: PokemonListItem;
};

const PokemonCard = memo(({ pokemon }: Props) => {
  const colors = useThemeColors();
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(pokemon.id);
  const formattedNumber = `#${pokemon.id.toString().padStart(4, "0")}`;
  const typeGradient = getMultiTypeGradient(pokemon.types);

  return (
    <LinearGradient
      style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.text }]}
      colors={[colors.cardBorder, colors.card, typeGradient[0]]}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}>
      <View style={styles.textContainer}>
        <View>
          <Text style={[styles.number, { color: colors.textTertiary }]}>{formattedNumber}</Text>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[styles.name, { color: colors.text }]}>
            {pokemon.name}
          </Text>
          <View style={styles.typesContainer}>
            {pokemon.types.map((type) => (
              <TypeBadge key={type} type={type} variant="badge" />
            ))}
          </View>
        </View>
      </View>

      <View style={styles.rightColumn}>
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            toggleFavorite(pokemon);
          }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.favoriteButton}>
          <Heart
            size={18}
            color={favorite ? "#FFF" : colors.text}
            fill={favorite ? "#FFF" : "transparent"}
            strokeWidth={2}
          />
        </TouchableOpacity>

        <View style={styles.imageContainer}>
          <Image source={{ uri: pokemon.image }} style={styles.image} contentFit="contain" />
        </View>
      </View>
    </LinearGradient>
  );
});

PokemonCard.displayName = "PokemonCard";

export default PokemonCard;
