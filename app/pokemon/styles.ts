import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabsWrapper: {
    zIndex: 10,
    position: "relative",
  },
  content: {
    flex: 1,
  },
  invertedRadiusContainer: {
    position: "absolute",
    zIndex: 999,
    bottom: 0,
  },
  invertedRadiusCurve: {
    flex: 1,
    width: 16,
  },
});

export default styles;
