import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebProjectDetailScreen } from "../../screens/WebProjectDetailScreen";

export default function ProjectRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <SafeAreaView edges={["top", "bottom"]} style={styles.safe}><WebProjectDetailScreen projectId={id} onBack={() => router.back()} onOpenAccount={() => router.push("/account")} /></SafeAreaView>;
}

const styles = StyleSheet.create({ safe: { flex: 1 } });
