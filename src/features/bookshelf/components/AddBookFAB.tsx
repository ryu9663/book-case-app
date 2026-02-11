import { StyleSheet } from "react-native";
import { FAB } from "react-native-paper";
import { colors } from "@/lib/theme/colors";

interface Props {
  onPress: () => void;
}

export function AddBookFAB({ onPress }: Props) {
  return (
    <FAB icon="plus" onPress={onPress} style={styles.fab} color="#FFFFFF" />
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 20,
    bottom: 30, // Adjusted position
    backgroundColor: colors.shelfDark, // Darker wood for contrast
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
