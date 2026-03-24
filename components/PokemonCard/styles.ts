import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
    marginLeft: 1,
  },
  textContainer: {
    flex: 1,
    gap: 4,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  number: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  favoriteButton: {
    padding: 2,
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
  image: {
    width: 90,
    height: 90,
    flexShrink: 0,
  },
});
