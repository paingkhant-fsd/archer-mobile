import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { WebAccountScreen } from "../../screens/WebAccountScreen";

export default function AccountRoute() {
  return <SafeAreaView edges={["top"]} style={styles.safe}><WebAccountScreen onBack={() => router.back()} /></SafeAreaView>;
}

const styles = StyleSheet.create({ safe: { flex: 1 } });
