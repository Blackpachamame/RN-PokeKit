import { FavoritesProvider } from "@/context/FavoritesContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <FavoritesProvider>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen
              name="pokedex"
              options={{ headerShown: false, animation: "slide_from_right" }}
            />
            <Stack.Screen
              name="favorites"
              options={{ headerShown: false, animation: "slide_from_right" }}
            />
            <Stack.Screen
              name="pokemon/[id]"
              options={{ headerShown: false, animation: "slide_from_right" }}
            />
            <Stack.Screen
              name="guess"
              options={{ headerShown: false, animation: "slide_from_right" }}
            />
            <Stack.Screen
              name="compare"
              options={{ headerShown: false, animation: "slide_from_right" }}
            />
          </Stack>
        </FavoritesProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
