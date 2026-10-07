import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View, useColorScheme } from "react-native";
import { api } from "../api/client";
import type { Project } from "../api/types";
import { ScreenState } from "../components/ScreenState";
import { colors, createTheme } from "../theme";
import { formatBudget, formatDate, formatRelativeDate } from "../utils/format";

export function ProjectDetailScreen({ projectId, onBack }: { projectId: string; onBack: () => void }) {
  const theme = createTheme(useColorScheme() === "dark");
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    api.project(projectId).then(({ project: result }) => { if (active) setProject(result); }).catch((reason) => { if (active) setError(reason instanceof Error ? reason.message : "Project could not be loaded."); });
    return () => { active = false; };
  }, [attempt, projectId]);

  if (!project) {
    return <View style={[styles.screen, { backgroundColor: theme.background }]}><Header onBack={onBack} theme={theme} />{error ? <ScreenState title="Couldn’t open project" message={error} action="Try again" onAction={() => { setError(null); setAttempt((value) => value + 1); }} /> : <ScreenState loading title="Opening project" message="Loading the latest project details…" />}</View>;
  }

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <Header onBack={onBack} theme={theme} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.meta}><Text style={styles.category}>{project.category.name}</Text><View style={styles.status}><View style={styles.dot} /><Text style={styles.statusText}>Accepting proposals</Text></View></View>
        <Text style={[styles.title, { color: theme.text }]}>{project.title}</Text>
        <Text style={[styles.description, { color: theme.muted }]}>{project.description}</Text>
        <View style={[styles.facts, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Fact label="BUDGET" value={formatBudget(project)} theme={theme} />
          <Fact label="DEADLINE" value={formatDate(project.deadline)} theme={theme} />
          <Fact label="INTEREST" value={`${project.proposalsCount} proposal${project.proposalsCount === 1 ? "" : "s"}`} theme={theme} />
          <Fact label="POSTED" value={formatRelativeDate(project.createdAt)} theme={theme} />
        </View>
        <SectionTitle theme={theme}>Skills</SectionTitle>
        <View style={styles.skills}>{project.skills.map((skill) => <View key={skill.id} style={[styles.skill, { backgroundColor: theme.surface, borderColor: theme.border }]}><Text style={[styles.skillText, { color: theme.text }]}>{skill.name}</Text></View>)}</View>
        <SectionTitle theme={theme}>About the client</SectionTitle>
        <View style={[styles.client, { backgroundColor: theme.surface, borderColor: theme.border }]}><View style={styles.avatar}><Text style={styles.avatarText}>{project.client.name.slice(0, 1).toUpperCase()}</Text></View><View><Text style={[styles.clientName, { color: theme.text }]}>{project.client.name}</Text><Text style={[styles.clientMeta, { color: theme.muted }]}>Project owner</Text></View></View>
        <View style={[styles.notice, { backgroundColor: colors.primarySoft }]}><Text style={styles.noticeTitle}>Proposals are coming next</Text><Text style={styles.noticeText}>Archer does not create payment or escrow records. Proposal submission will be enabled when that API contract is available.</Text></View>
      </ScrollView>
    </View>
  );
}

function Header({ onBack, theme }: { onBack: () => void; theme: ReturnType<typeof createTheme> }) {
  return <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}><Pressable accessibilityRole="button" accessibilityLabel="Back to projects" onPress={onBack} hitSlop={10} style={({ pressed }) => pressed && styles.pressed}><Text style={[styles.back, { color: theme.text }]}>‹</Text></Pressable><Text style={[styles.headerTitle, { color: theme.text }]}>Project details</Text><View style={styles.headerSpacer} /></View>;
}

function Fact({ label, value, theme }: { label: string; value: string; theme: ReturnType<typeof createTheme> }) { return <View style={styles.fact}><Text style={[styles.factLabel, { color: theme.muted }]}>{label}</Text><Text style={[styles.factValue, { color: theme.text }]}>{value}</Text></View>; }
function SectionTitle({ children, theme }: { children: string; theme: ReturnType<typeof createTheme> }) { return <Text style={[styles.sectionTitle, { color: theme.text }]}>{children}</Text>; }

const styles = StyleSheet.create({
  screen: { flex: 1 }, header: { height: 58, paddingHorizontal: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: StyleSheet.hairlineWidth }, back: { fontSize: 36, lineHeight: 38, fontWeight: "300" }, headerTitle: { fontSize: 16, fontWeight: "800" }, headerSpacer: { width: 20 }, pressed: { opacity: 0.5 }, content: { padding: 20, paddingBottom: 40 },
  meta: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, category: { color: colors.primary, fontSize: 11, fontWeight: "800", letterSpacing: 0.7, textTransform: "uppercase" }, status: { flexDirection: "row", alignItems: "center", gap: 6 }, dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.green }, statusText: { color: colors.green, fontSize: 11, fontWeight: "700" },
  title: { marginTop: 17, fontSize: 30, lineHeight: 37, fontWeight: "800", letterSpacing: -1 }, description: { marginTop: 14, fontSize: 15, lineHeight: 24 },
  facts: { marginTop: 24, padding: 17, flexDirection: "row", flexWrap: "wrap", borderWidth: 1, borderRadius: 18 }, fact: { width: "50%", paddingVertical: 9 }, factLabel: { fontSize: 9, fontWeight: "800", letterSpacing: 0.7 }, factValue: { marginTop: 5, paddingRight: 8, fontSize: 13, fontWeight: "700" },
  sectionTitle: { marginTop: 28, marginBottom: 12, fontSize: 18, fontWeight: "800" }, skills: { flexDirection: "row", flexWrap: "wrap", gap: 8 }, skill: { paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderRadius: 20 }, skillText: { fontSize: 12, fontWeight: "600" },
  client: { padding: 15, flexDirection: "row", alignItems: "center", gap: 12, borderWidth: 1, borderRadius: 16 }, avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" }, avatarText: { color: "white", fontSize: 17, fontWeight: "800" }, clientName: { fontSize: 14, fontWeight: "800" }, clientMeta: { marginTop: 3, fontSize: 11 },
  notice: { marginTop: 25, padding: 17, borderRadius: 15 }, noticeTitle: { color: colors.primaryDark, fontSize: 14, fontWeight: "800" }, noticeText: { marginTop: 6, color: "#3E5E91", fontSize: 12, lineHeight: 18 },
});
