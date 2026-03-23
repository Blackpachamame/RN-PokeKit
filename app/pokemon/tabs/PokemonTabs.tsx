import { useThemeColors } from "@/hooks/useThemedStyles";
import { PokemonTab } from "@/types/pokemon";
import { BarChart3, Info, LucideIcon, Zap } from "lucide-react-native";
import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import styles from "./styles";

type TabConfig = {
  key: PokemonTab;
  label: string;
  Icon: LucideIcon;
};

const TABS: TabConfig[] = [
  { key: "about", label: "About", Icon: Info },
  { key: "stats", label: "Stats", Icon: BarChart3 },
  { key: "moves", label: "Moves", Icon: Zap },
];

type Props = {
  activeTab: PokemonTab;
  onTabChange: (tab: PokemonTab) => void;
  accentColor?: string;
};

const AnimatedView = Animated.createAnimatedComponent(View);

function TabItem({
  tab,
  isActive,
  onPress,
  accentColor,
  inactiveColor,
}: {
  tab: TabConfig;
  isActive: boolean;
  onPress: () => void;
  accentColor: string;
  inactiveColor: string;
}) {
  const { Icon } = tab;

  // Valores animados
  const scale = useSharedValue(isActive ? 1 : 0.8);
  const opacity = useSharedValue(isActive ? 1 : 0);

  useEffect(() => {
    if (isActive) {
      // Fade in desde el centro
      scale.value = withTiming(1, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      });
      opacity.value = withTiming(1, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      });
    } else {
      // Fade out hacia el centro
      scale.value = withTiming(0.8, {
        duration: 200,
        easing: Easing.in(Easing.cubic),
      });
      opacity.value = withTiming(0, {
        duration: 200,
        easing: Easing.in(Easing.cubic),
      });
    }
  }, [isActive]);

  const animatedBackgroundStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Pressable onPress={onPress} style={styles.tab}>
      <View style={styles.tabContent}>
        {/* Background animado */}
        {isActive && (
          <AnimatedView
            style={[
              styles.tabBackground,
              { backgroundColor: accentColor },
              animatedBackgroundStyle,
            ]}
          />
        )}

        {/* Ícono */}
        <Icon
          size={20}
          color={isActive ? "#fff" : inactiveColor}
          strokeWidth={2.5}
          style={{ zIndex: 2 }}
        />

        {/* Label */}
        {isActive && <Text style={[styles.tabLabel, { zIndex: 2 }]}>{tab.label}</Text>}
      </View>
    </Pressable>
  );
}

export default function PokemonTabs({ activeTab, onTabChange, accentColor = "#6390F0" }: Props) {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <View style={[styles.tabsWrapper, { backgroundColor: colors.tabBackground }]}>
        {TABS.map((tab) => (
          <TabItem
            key={tab.key}
            tab={tab}
            isActive={activeTab === tab.key}
            onPress={() => onTabChange(tab.key)}
            accentColor={accentColor}
            inactiveColor={colors.tabInactive}
          />
        ))}
      </View>
    </View>
  );
}
