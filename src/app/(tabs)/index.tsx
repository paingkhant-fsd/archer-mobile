import { router } from "expo-router";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HomeScreen } from "../../screens/HomeScreen";

export default function ProjectsRoute() {
  return <SafeAreaView edges={["top"]} style={styles.safe}><HomeScreen onOpenProject={(id) => router.push({ pathname: "/projects/[id]", params: { id } })} onOpenAccount={() => router.push("/account")} /></SafeAreaView>;
}

const styles = StyleSheet.create({ safe: { flex: 1 } });
