import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 0,
    elevation: 1,
    marginLeft: 1,
  },
  textContainer: {
    flex: 1,
    gap: 4,
  },
  number: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  typesContainer: {
    flexDirection: "row",
    gap: 6,
    marginTop: 4,
  },
  imageContainer: {
    width: 80,
    height: 72,
    flexShrink: 0,
  },
  image: {
    width: "100%",
    height: undefined,
    aspectRatio: 1,
  },
  rightColumn: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 4,
  },
  favoriteButton: {
    padding: 4,
    alignSelf: "flex-end",
  },
});
