import { Tabs } from "expo-router";
import { StyleSheet, Text, useColorScheme } from "react-native";
import { colors, createTheme } from "../../theme";

export default function TabLayout() {
  const theme = createTheme(useColorScheme() === "dark");
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: { display: "none" },
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: theme.muted,
      tabBarLabelStyle: styles.label,
    }}>
      <Tabs.Screen name="index" options={{ title: "Projects", tabBarAccessibilityLabel: "Projects tab", tabBarIcon: ({ color }) => <Text style={[styles.icon, { color }]}>⌕</Text> }} />
      <Tabs.Screen name="account" options={{ title: "Account", tabBarAccessibilityLabel: "Account tab", tabBarIcon: ({ color }) => <Text style={[styles.icon, { color }]}>○</Text> }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({ icon: { fontSize: 25, lineHeight: 27 }, label: { fontSize: 12, fontWeight: "600" } });
