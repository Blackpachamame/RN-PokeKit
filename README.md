# 🎮 PokéKit - React Native App

Una aplicación móvil moderna para explorar el universo Pokémon, construida con React Native y PokeAPI. Permite navegar por más de 1,000 Pokémon con búsqueda en tiempo real, filtros por tipo, detalles completos, favoritos y un juego de adivinanza.

---

## ✨ Características Principales

- **🔍 Búsqueda inteligente** - Búsqueda en tiempo real con debounce sobre 1,025 Pokémon
- **♾️ Scroll infinito** - Carga paginada progresiva para óptima performance
- **🎨 Filtros por tipo** - Filtra por múltiples tipos simultáneamente (18 tipos disponibles)
- **📊 Pantalla de detalles completa**
  - Información general (altura, peso, categoría, habilidades)
  - Estadísticas visualizadas con barras de progreso animadas
  - Lista completa de movimientos con tipo, categoría, poder y precisión
  - Cadena evolutiva con layouts adaptativos (lineal, ramificada)
- **❤️ Favoritos** - Guardado persistente de Pokémon con AsyncStorage
- **🎯 Who's That Pokémon?** - Juego de adivinanza con siluetas, dificultad Easy/Hard, puntuación, racha y récord persistido
- **🌙 Modo oscuro** - Sistema de temas con persistencia y detección automática del sistema
- **💀 Skeleton loaders** - Placeholders animados durante la carga
- **🔄 Pull-to-refresh** - Recarga manual de datos
- **⚡ Optimizaciones**
  - `expo-image` para caché persistente de imágenes en disco
  - `React.memo` en componentes críticos
  - Deduplicación de datos con `Map`
  - Manejo de race conditions en búsquedas concurrentes
  - Virtual lists con `FlatList` (`removeClippedSubviews`, `windowSize`)
  - Fetching en paralelo con `Promise.all`

---

## 🛠️ Stack Tecnológico

### Core
- **React Native** - Framework principal
- **Expo SDK 54** - Desarrollo y build
- **TypeScript** - Type safety

### State Management & Data
- **Context API** - Estado global (tema, favoritos)
- **Custom Hooks** - Lógica reutilizable (`usePokemonList`, `usePokemonSearch`, `useTypeFilter`, `usePokedexData`, `useGuessGame`)
- **AsyncStorage** - Persistencia local (favoritos, récords del juego, tema)
- **Axios** - Cliente HTTP

### UI/UX
- **React Native Reanimated** - Animaciones de alto rendimiento (tabs, ThemeToggle)
- **Expo Image** - Carga y caché optimizada de imágenes
- **Expo Linear Gradient** - Gradientes en cards y headers
- **Lucide React Native** - Sistema de iconos
- **React Native SVG** - Iconos de tipos personalizados
- **React Native Safe Area Context** - Manejo de safe areas

### Navigation
- **Expo Router** - Navegación file-based con rutas tipadas

### API
- **PokeAPI v2** - Fuente de datos oficial de Pokémon

---

## 🚀 Instalación y Uso

### Prerrequisitos

```bash
node >= 18.0.0
npm >= 9.0.0
```

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/pokekit-app.git
cd pokekit-app

# Instalar dependencias
npm install
```

### Desarrollo

```bash
# Iniciar el servidor de desarrollo
npm start

# Ejecutar en iOS (requiere macOS y Xcode)
npm run ios

# Ejecutar en Android (requiere Android Studio)
npm run android

# Ejecutar en web
npm run web
```

---

## 📁 Estructura del Proyecto

```
pokekit-app/
├── app/                          # Screens (Expo Router)
│   ├── _layout.tsx              # Root layout con providers
│   ├── index.tsx                # Home con 4 cards de navegación
│   ├── pokedex.tsx              # Pokédex con búsqueda y filtros
│   ├── favorites.tsx            # Pokémon guardados
│   ├── guess.tsx                # Juego Who's That Pokémon?
│   ├── compare.tsx              # Comparador (próximamente)
│   └── pokemon/
│       ├── [id].tsx             # Pantalla de detalle
│       └── tabs/                # Tabs de detalle
│           ├── AboutTab.tsx
│           ├── StatsTab.tsx
│           ├── MovesTab.tsx
│           └── PokemonTabs.tsx
├── components/                  # Componentes reutilizables
│   ├── HomeScreen/              # Header y cards del home
│   ├── ScreenHeader/            # Header genérico con back + ThemeToggle
│   ├── PokemonCard/             # Card de Pokémon en lista
│   ├── PokemonHeader/           # Header de pantalla de detalle
│   ├── SearchBar/               # Barra de búsqueda
│   ├── TypeFilters/             # Filtros horizontales por tipo
│   ├── TypeBadge/               # Badge/chip de tipo (2 variantes)
│   ├── StatBar/                 # Barra de estadística animada
│   ├── MoveCard/                # Card de movimiento
│   ├── GuessGame/               # Componentes del juego
│   ├── FavoritesScreen/         # Counter y empty state de favoritos
│   ├── PokedexScreen/           # Counter de resultados y estilos
│   ├── ThemeToggle/             # Botón de tema con animación
│   ├── Skeletons/               # Loaders animados por contexto
│   ├── EmptyStates/             # Estados de carga, error y vacío
│   └── EndOfListMessage/        # Mensaje de fin de lista
├── context/                     # Context providers
│   ├── ThemeContext.tsx         # Tema (light/dark/auto) con persistencia
│   └── FavoritesContext.tsx     # Favoritos con persistencia
├── hooks/                       # Custom hooks
│   ├── usePokemonList.ts        # Lista principal con infinite scroll
│   ├── usePokemonSearch.ts      # Búsqueda con debounce y race conditions
│   ├── useTypeFilter.ts         # Filtrado por tipo con infinite scroll
│   ├── usePokedexData.ts        # Orquestador: combina lista, búsqueda y filtros
│   ├── useGuessGame.ts          # Lógica completa del juego
│   └── useThemedStyles.ts       # Helpers para estilos con tema
├── services/                    # API services
│   └── pokeapi.ts              # Cliente de PokeAPI (axios)
├── types/                       # TypeScript types
│   └── pokemon.ts              # Interfaces y tipos de Pokémon
└── utils/                       # Utilidades
    ├── themes.ts               # Paletas de color light/dark
    ├── constants.ts            # HEADER_HEIGHT, SPACING
    ├── pokemonColors.ts        # Color por tipo
    ├── pokemonGradients.ts     # Gradientes por tipo
    ├── pokemonTypeIcons.ts     # Iconos SVG por tipo
    ├── pokemonTypes.ts         # IDs de tipos para la API
    └── color.ts                # Helpers para gradientes multi-tipo
```

---

## 🎓 Aprendizajes Clave

### Optimización de Performance
Este proyecto me permitió profundizar en técnicas de optimización para apps con grandes volúmenes de datos. Implementé scroll infinito con paginación, deduplicación de items con `Map`, y manejo de race conditions en búsquedas concurrentes usando `refs`. También aprendí a usar `React.memo` estratégicamente, a optimizar `FlatList` con `removeClippedSubviews` y `windowSize`, y a aprovechar `expo-image` para caché persistente de imágenes en disco.

### Arquitectura Escalable
Desarrollé un sistema de custom hooks que separa la lógica de negocio de la UI. El hook `usePokedexData` orquesta tres sub-hooks independientes (`usePokemonList`, `usePokemonSearch`, `useTypeFilter`) y expone una interfaz unificada a la pantalla. El sistema de temas con Context API + AsyncStorage maneja persistencia y detección automática de preferencias del sistema. El patrón `createStyles(colors)` con `useMemo` garantiza estilos reactivos al tema sin recreaciones innecesarias.

### UX Consciente
Implementar skeleton loaders por contexto (header, tabs, contenido) en lugar de spinners genéricos mejoró la percepción de velocidad. El debounce en búsquedas, el manejo granular de estados (loading inicial vs. loading more), y las animaciones de reveal en el juego demuestran atención al detalle en la experiencia del usuario.

---

## 🔮 Próximas Mejoras

- [ ] **Comparador de Pokémon** - Comparar stats lado a lado
- [ ] **Filtros avanzados** - Por generación, stats mínimos
- [ ] **Animaciones de transición** - Shared element transitions entre pantallas
- [ ] **Haptic feedback** - Vibraciones sutiles en interacciones (expo-haptics)
- [ ] **Testing** - Unit tests (Jest) + E2E (Detox)
- [ ] **Offline mode** - Cache de Pokémon visitados

---

## 🙏 Agradecimientos

- [PokeAPI](https://pokeapi.co/) - API gratuita de datos de Pokémon

---

<div align="center">
  <p>Hecho con ❤️ y React Native</p>
  <p>⭐ Si te gustó el proyecto, dale una estrella en GitHub!</p>
</div>