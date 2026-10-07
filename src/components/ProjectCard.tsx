import { Pressable, StyleSheet, Text, View, useColorScheme } from "react-native";
import type { Project } from "../api/types";
import { colors, createTheme } from "../theme";
import { formatBudget, formatRelativeDate } from "../utils/format";

export function ProjectCard({ project, onPress }: { project: Project; onPress: () => void }) {
  const theme = createTheme(useColorScheme() === "dark");
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`Open ${project.title}`} onPress={onPress} style={({ pressed }) => [styles.card, { backgroundColor: theme.surface, borderColor: theme.border }, pressed && styles.pressed]}>
      <View style={styles.topRow}><Text style={styles.category}>{project.category.name}</Text><View style={styles.status}><View style={styles.dot} /><Text style={styles.statusText}>Accepting proposals</Text></View></View>
      <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>{project.title}</Text>
      <Text style={[styles.description, { color: theme.muted }]} numberOfLines={3}>{project.description}</Text>
      <View style={styles.skills}>{project.skills.slice(0, 4).map((skill) => <View key={skill.id} style={[styles.skill, { backgroundColor: theme.background }]}><Text style={[styles.skillText, { color: theme.muted }]}>{skill.name}</Text></View>)}</View>
      <View style={[styles.footer, { borderTopColor: theme.border }]}>
        <View><Text style={[styles.label, { color: theme.muted }]}>BUDGET</Text><Text style={[styles.value, { color: theme.text }]}>{formatBudget(project)}</Text></View>
        <View style={styles.right}><Text style={[styles.label, { color: theme.muted }]}>POSTED</Text><Text style={[styles.value, { color: theme.text }]}>{formatRelativeDate(project.createdAt)}</Text></View>
        <View style={styles.right}><Text style={[styles.label, { color: theme.muted }]}>PROPOSALS</Text><Text style={[styles.value, { color: theme.text }]}>{project.proposalsCount}</Text></View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { marginHorizontal: 20, marginBottom: 14, padding: 21, borderWidth: 1, borderRadius: 12 }, pressed: { opacity: 0.72 },
  topRow: { alignItems: "flex-start", gap: 9 }, category: { color: colors.primary, fontSize: 11, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.7 },
  status: { flexDirection: "row", alignItems: "center", gap: 6 }, dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.green }, statusText: { color: colors.green, fontSize: 11, fontWeight: "700" },
  title: { marginTop: 20, fontSize: 21, lineHeight: 28, fontWeight: "800", letterSpacing: -0.6 }, description: { minHeight: 46, marginTop: 9, fontSize: 13, lineHeight: 22 },
  skills: { flexDirection: "row", flexWrap: "wrap", gap: 7, marginTop: 17 }, skill: { paddingHorizontal: 9, paddingVertical: 6, borderRadius: 5 }, skillText: { fontSize: 10, fontWeight: "700" },
  footer: { flexDirection: "row", alignItems: "flex-start", marginTop: 23, paddingTop: 18, borderTopWidth: StyleSheet.hairlineWidth }, label: { fontSize: 8, fontWeight: "800", letterSpacing: 0.7 }, value: { marginTop: 5, fontSize: 11, fontWeight: "800" }, right: { marginLeft: 18, flexShrink: 1 },
});
