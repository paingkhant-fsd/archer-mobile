import { ActivityIndicator, Pressable, StyleSheet, Text, View, useColorScheme } from "react-native";
import { colors, createTheme } from "../theme";

export function ScreenState({ title, message, action, onAction, loading = false }: { title: string; message: string; action?: string; onAction?: () => void; loading?: boolean }) {
  const theme = createTheme(useColorScheme() === "dark");
  return (
    <View style={styles.container} accessibilityRole={loading ? "progressbar" : undefined}>
      {loading ? <ActivityIndicator size="large" color={colors.primary} /> : <View style={styles.icon}><Text style={styles.iconText}>↗</Text></View>}
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.message, { color: theme.muted }]}>{message}</Text>
      {action && onAction ? <Pressable accessibilityRole="button" onPress={onAction} style={({ pressed }) => [styles.button, pressed && styles.pressed]}><Text style={styles.buttonText}>{action}</Text></Pressable> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, minHeight: 300, alignItems: "center", justifyContent: "center", padding: 32 },
  icon: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.primarySoft, alignItems: "center", justifyContent: "center" },
  iconText: { color: colors.primary, fontSize: 23, fontWeight: "800" },
  title: { marginTop: 18, fontSize: 20, fontWeight: "800", textAlign: "center" },
  message: { marginTop: 8, fontSize: 14, lineHeight: 21, textAlign: "center" },
  button: { marginTop: 22, minHeight: 46, paddingHorizontal: 24, alignItems: "center", justifyContent: "center", backgroundColor: colors.primary, borderRadius: 12 },
  buttonText: { color: colors.white, fontWeight: "700" }, pressed: { opacity: 0.75 },
});
