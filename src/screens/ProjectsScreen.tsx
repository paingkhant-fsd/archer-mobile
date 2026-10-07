import { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, TextInput, View, useColorScheme } from "react-native";
import { api } from "../api/client";
import type { Currency, Project } from "../api/types";
import { ProjectCard } from "../components/ProjectCard";
import { ScreenState } from "../components/ScreenState";
import { colors, createTheme } from "../theme";

type CurrencyFilter = Currency | "";

export function ProjectsScreen({ onOpenProject }: { onOpenProject: (id: string) => void }) {
  const theme = createTheme(useColorScheme() === "dark");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [currency, setCurrency] = useState<CurrencyFilter>("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (nextPage = 1, append = false) => {
    try {
      const result = await api.projects({ search, currency: currency || undefined, page: nextPage, pageSize: 8 });
      setProjects((current) => append ? [...current, ...result.items] : result.items);
      setPage(result.page); setTotalPages(result.totalPages);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Projects could not be loaded."); }
    finally { setLoading(false); setLoadingMore(false); setRefreshing(false); }
  }, [currency, search]);

  function applySearch() {
    const nextSearch = searchInput.trim();
    if (nextSearch === search) return;
    setLoading(true); setError(null); setSearch(nextSearch);
  }

  useEffect(() => {
    let active = true;
    api.projects({ search, currency: currency || undefined, page: 1, pageSize: 8 })
      .then((result) => {
        if (!active) return;
        setProjects(result.items); setPage(result.page); setTotalPages(result.totalPages);
      })
      .catch((reason) => {
        if (active) setError(reason instanceof Error ? reason.message : "Projects could not be loaded.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [currency, search]);

  const header = (
    <View>
      <View style={styles.header}><View><Text style={[styles.eyebrow, { color: colors.primary }]}>FIND YOUR NEXT PROJECT</Text><Text style={[styles.heading, { color: theme.text }]}>Work worth doing.</Text></View><View style={styles.logo}><Text style={styles.logoText}>↗</Text></View></View>
      <View style={[styles.searchBox, { backgroundColor: theme.input, borderColor: theme.border }]}><Text style={styles.searchIcon}>⌕</Text><TextInput value={searchInput} onChangeText={setSearchInput} onSubmitEditing={applySearch} returnKeyType="search" placeholder="Search title or description" placeholderTextColor={theme.muted} style={[styles.searchInput, { color: theme.text }]} accessibilityLabel="Search projects" /><Pressable onPress={applySearch} hitSlop={8}><Text style={styles.searchAction}>Search</Text></Pressable></View>
      <View style={styles.filters}>{(["", "USD", "MMK"] as CurrencyFilter[]).map((value) => <Pressable key={value || "all"} onPress={() => { if (currency !== value) { setLoading(true); setError(null); setCurrency(value); } }} style={[styles.filter, { borderColor: currency === value ? colors.primary : theme.border, backgroundColor: currency === value ? colors.primarySoft : theme.surface }]}><Text style={[styles.filterText, { color: currency === value ? colors.primary : theme.muted }]}>{value || "All currencies"}</Text></Pressable>)}</View>
      {!loading && !error && <Text style={[styles.resultCount, { color: theme.muted }]}>{projects.length === 1 ? "1 project" : `${projects.length} projects`}{totalPages > 1 ? ` · page ${page} of ${totalPages}` : ""}</Text>}
    </View>
  );

  if (loading && projects.length === 0) return <View style={[styles.screen, { backgroundColor: theme.background }]}>{header}<ScreenState loading title="Finding projects" message="Loading published work from Archer…" /></View>;
  if (error && projects.length === 0) return <View style={[styles.screen, { backgroundColor: theme.background }]}>{header}<ScreenState title="Couldn’t load projects" message={error} action="Try again" onAction={() => { setLoading(true); setError(null); void load(); }} /></View>;

  return (
    <FlatList style={{ backgroundColor: theme.background }} contentContainerStyle={styles.list} data={projects} keyExtractor={(item) => item.id} renderItem={({ item }) => <ProjectCard project={item} onPress={() => onOpenProject(item.id)} />} ListHeaderComponent={header} ListEmptyComponent={<ScreenState title="No matching projects" message="Try a broader search or clear the currency filter." action="Clear filters" onAction={() => { if (search || currency) { setLoading(true); setError(null); setSearchInput(""); setSearch(""); setCurrency(""); } else { void load(); } }} />} ListFooterComponent={page < totalPages ? <Pressable disabled={loadingMore} onPress={() => { setLoadingMore(true); void load(page + 1, true); }} style={styles.more}><Text style={styles.moreText}>{loadingMore ? "Loading…" : "Load more projects"}</Text></Pressable> : <View style={styles.footerSpace} />} refreshControl={<RefreshControl refreshing={refreshing} tintColor={colors.primary} onRefresh={() => { setRefreshing(true); setError(null); void load(); }} />} />
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 }, list: { paddingBottom: 8 }, header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 24, paddingBottom: 18 },
  eyebrow: { fontSize: 10, fontWeight: "800", letterSpacing: 1.2 }, heading: { marginTop: 5, fontSize: 29, fontWeight: "800", letterSpacing: -1 }, logo: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", transform: [{ rotate: "-6deg" }] }, logoText: { color: "white", fontSize: 22, fontWeight: "800", transform: [{ rotate: "6deg" }] },
  searchBox: { minHeight: 50, marginHorizontal: 20, paddingHorizontal: 13, flexDirection: "row", alignItems: "center", borderWidth: 1, borderRadius: 14 }, searchIcon: { color: colors.primary, fontSize: 22, marginRight: 8 }, searchInput: { flex: 1, fontSize: 14 }, searchAction: { color: colors.primary, fontSize: 13, fontWeight: "800" },
  filters: { flexDirection: "row", gap: 8, paddingHorizontal: 20, paddingTop: 12 }, filter: { paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderRadius: 18 }, filterText: { fontSize: 11, fontWeight: "700" }, resultCount: { marginHorizontal: 21, marginTop: 20, marginBottom: 11, fontSize: 12, fontWeight: "600" },
  more: { minHeight: 48, marginHorizontal: 20, marginVertical: 8, alignItems: "center", justifyContent: "center", borderRadius: 13, backgroundColor: colors.primary }, moreText: { color: colors.white, fontWeight: "800" }, footerSpace: { height: 10 },
});
