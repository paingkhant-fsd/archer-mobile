import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, useColorScheme } from "react-native";
import { ApiError } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { colors, createTheme } from "../theme";

export function AccountScreen() {
  const theme = createTheme(useColorScheme() === "dark");
  const { user, login, logout } = useAuth();
  const [email, setEmail] = useState("freelancer1@archer.local");
  const [password, setPassword] = useState("ArcherDemo123!");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setBusy(true); setError(null);
    try { await login(email, password); }
    catch (reason) { setError(reason instanceof ApiError && reason.code === "INVALID_CREDENTIALS" ? "Email or password is incorrect." : reason instanceof Error ? reason.message : "Sign in failed."); }
    finally { setBusy(false); }
  }

  if (user) {
    return (
      <ScrollView style={{ backgroundColor: theme.background }} contentContainerStyle={styles.profileContent}>
        <Text style={[styles.kicker, { color: colors.primary }]}>YOUR ARCHER ACCOUNT</Text><Text style={[styles.title, { color: theme.text }]}>Welcome back.</Text>
        <View style={[styles.profileCard, { backgroundColor: theme.surface, borderColor: theme.border }]}><View style={styles.avatar}><Text style={styles.avatarText}>{user.name.slice(0, 1).toUpperCase()}</Text></View><Text style={[styles.name, { color: theme.text }]}>{user.name}</Text><Text style={[styles.email, { color: theme.muted }]}>{user.email}</Text><View style={styles.role}><Text style={styles.roleText}>{user.role}</Text></View>{user.headline ? <Text style={[styles.headline, { color: theme.text }]}>{user.headline}</Text> : null}{user.location ? <Text style={[styles.location, { color: theme.muted }]}>{user.location}</Text> : null}</View>
        <View style={[styles.info, { borderColor: theme.border }]}><Text style={[styles.infoTitle, { color: theme.text }]}>Session security</Text><Text style={[styles.infoText, { color: theme.muted }]}>The short-lived access token stays in memory. Your rotating refresh token is stored in this device’s secure keychain or keystore.</Text></View>
        <Pressable accessibilityRole="button" onPress={() => void logout()} style={({ pressed }) => [styles.outlineButton, { borderColor: theme.border }, pressed && styles.pressed]}><Text style={styles.outlineButtonText}>Sign out</Text></Pressable>
      </ScrollView>
    );
  }

  return (
    <KeyboardAvoidingView style={[styles.screen, { backgroundColor: theme.background }]} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
        <View style={styles.brandRow}><View style={styles.logo}><Text style={styles.logoText}>↗</Text></View><Text style={[styles.brand, { color: theme.text }]}>archer.</Text></View>
        <Text style={[styles.kicker, { color: colors.primary }]}>MOBILE WORKSPACE</Text><Text style={[styles.title, { color: theme.text }]}>Sign in to your account.</Text><Text style={[styles.subtitle, { color: theme.muted }]}>Browse publicly without an account, or sign in to restore your Archer session securely.</Text>
        <View style={[styles.form, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.label, { color: theme.text }]}>Email address</Text><TextInput autoCapitalize="none" autoComplete="email" keyboardType="email-address" value={email} onChangeText={setEmail} placeholder="you@example.com" placeholderTextColor={theme.muted} style={[styles.input, { backgroundColor: theme.input, borderColor: theme.border, color: theme.text }]} />
          <Text style={[styles.label, { color: theme.text }]}>Password</Text><TextInput autoCapitalize="none" autoComplete="current-password" secureTextEntry value={password} onChangeText={setPassword} onSubmitEditing={() => void submit()} placeholder="At least 8 characters" placeholderTextColor={theme.muted} style={[styles.input, { backgroundColor: theme.input, borderColor: theme.border, color: theme.text }]} />
          {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
          <Pressable accessibilityRole="button" disabled={busy || !email || password.length < 8} onPress={() => void submit()} style={({ pressed }) => [styles.button, (busy || !email || password.length < 8) && styles.disabled, pressed && styles.pressed]}><Text style={styles.buttonText}>{busy ? "Signing in…" : "Sign in"}</Text></Pressable>
          <Text style={[styles.demo, { color: theme.muted }]}>Local demo credentials are prefilled for development.</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 }, content: { flexGrow: 1, padding: 24, paddingTop: 34 }, profileContent: { padding: 24, paddingTop: 34, paddingBottom: 40 }, brandRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 38 }, logo: { width: 38, height: 38, borderRadius: 11, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", transform: [{ rotate: "-6deg" }] }, logoText: { color: "white", fontSize: 21, fontWeight: "800", transform: [{ rotate: "6deg" }] }, brand: { fontSize: 21, fontWeight: "800", letterSpacing: -0.8 },
  kicker: { fontSize: 10, fontWeight: "800", letterSpacing: 1.2 }, title: { marginTop: 7, fontSize: 29, lineHeight: 36, fontWeight: "800", letterSpacing: -1 }, subtitle: { marginTop: 10, fontSize: 14, lineHeight: 22 },
  form: { marginTop: 28, padding: 19, borderWidth: 1, borderRadius: 18 }, label: { marginBottom: 7, fontSize: 12, fontWeight: "700" }, input: { height: 49, marginBottom: 17, paddingHorizontal: 13, borderWidth: 1, borderRadius: 11, fontSize: 14 }, error: { marginTop: -4, marginBottom: 13, color: colors.danger, fontSize: 12, lineHeight: 17 }, button: { height: 50, alignItems: "center", justifyContent: "center", backgroundColor: colors.primary, borderRadius: 12 }, buttonText: { color: "white", fontSize: 14, fontWeight: "800" }, disabled: { opacity: 0.55 }, pressed: { opacity: 0.72 }, demo: { marginTop: 14, fontSize: 10, textAlign: "center" },
  profileCard: { marginTop: 28, padding: 24, alignItems: "center", borderWidth: 1, borderRadius: 20 }, avatar: { width: 72, height: 72, borderRadius: 36, alignItems: "center", justifyContent: "center", backgroundColor: colors.primary }, avatarText: { color: "white", fontSize: 28, fontWeight: "800" }, name: { marginTop: 14, fontSize: 21, fontWeight: "800" }, email: { marginTop: 5, fontSize: 13 }, role: { marginTop: 13, paddingHorizontal: 11, paddingVertical: 5, borderRadius: 15, backgroundColor: colors.primarySoft }, roleText: { color: colors.primaryDark, fontSize: 10, fontWeight: "800", letterSpacing: 0.5 }, headline: { marginTop: 16, fontSize: 14, fontWeight: "700", textAlign: "center" }, location: { marginTop: 6, fontSize: 12 },
  info: { marginTop: 18, padding: 17, borderWidth: 1, borderRadius: 16 }, infoTitle: { fontSize: 13, fontWeight: "800" }, infoText: { marginTop: 6, fontSize: 12, lineHeight: 18 }, outlineButton: { height: 50, marginTop: 18, alignItems: "center", justifyContent: "center", borderWidth: 1, borderRadius: 12 }, outlineButtonText: { color: colors.danger, fontSize: 14, fontWeight: "800" },
});
