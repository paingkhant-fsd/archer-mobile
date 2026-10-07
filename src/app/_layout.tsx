import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, StyleSheet, Text, View, useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "../auth/AuthContext";
import { colors, createTheme } from "../theme";

export default function RootLayout() {
  return <SafeAreaProvider><AuthProvider><AppNavigator /></AuthProvider></SafeAreaProvider>;
}

function AppNavigator() {
  const colorScheme = useColorScheme();
  const theme = createTheme(colorScheme === "dark");
  const { isRestoring } = useAuth();

  if (isRestoring) {
    return <View style={[styles.loading, { backgroundColor: theme.background }]}><StatusBar style={colorScheme === "dark" ? "light" : "dark"} /><View style={styles.brandMark}><Text style={styles.brandArrow}>↗</Text></View><Text style={[styles.brand, { color: theme.text }]}>archer.</Text><ActivityIndicator color={colors.primary} style={styles.indicator} /><Text style={[styles.restoring, { color: theme.muted }]}>Restoring your session…</Text></View>;
  }

  return (
    <>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.background } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="projects/[id]" />
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({ loading: { flex: 1, alignItems: "center", justifyContent: "center" }, brandMark: { width: 44, height: 44, borderRadius: 13, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", transform: [{ rotate: "-6deg" }] }, brandArrow: { color: "white", fontSize: 25, fontWeight: "800", transform: [{ rotate: "6deg" }] }, brand: { marginTop: 12, fontSize: 24, fontWeight: "800", letterSpacing: -1 }, indicator: { marginTop: 28 }, restoring: { marginTop: 10, fontSize: 14 } });
