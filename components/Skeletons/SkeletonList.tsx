import { Fragment } from "react";
import { StyleSheet, View } from "react-native";
import { SkeletonCard } from "./SkeletonCard";

type Props = {
  count?: number;
};

/**
 * SkeletonList - Renderiza múltiples SkeletonCards
 * Usado mientras se carga la lista inicial de Pokémon
 */
export const SkeletonList = ({ count = 5 }: Props) => {
  return (
    <View>
      {Array.from({ length: count }).map((_, index) => (
        <Fragment key={index}>
          <SkeletonCard />
          {index < count - 1 && <View style={styles.separator} />}
        </Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  separator: {
    height: 16,
  },
});
