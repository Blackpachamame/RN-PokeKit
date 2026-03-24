import { FavoritesProvider } from "@/context/FavoritesContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { darkTheme, lightTheme } from "@/utils/themes";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

function AppStack() {
  const { resolvedTheme } = useTheme();
  const colors = resolvedTheme === "dark" ? darkTheme : lightTheme;

  // Sincroniza el color de fondo del sistema operativo (evita flash en transiciones)
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.background);
  }, [colors.background]);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar style={resolvedTheme === "dark" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          contentStyle: { backgroundColor: colors.background },
        }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="pokedex" />
        <Stack.Screen name="favorites" />
        <Stack.Screen name="pokemon/[id]" />
        <Stack.Screen name="guess" />
        <Stack.Screen name="compare" />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <FavoritesProvider>
          <AppStack />
        </FavoritesProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
