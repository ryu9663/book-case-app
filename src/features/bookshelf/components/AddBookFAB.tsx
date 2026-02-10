import { StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';
import { colors } from '@/lib/theme/colors';

interface Props {
  onPress: () => void;
}

export function AddBookFAB({ onPress }: Props) {
  return (
    <FAB
      icon="plus"
      onPress={onPress}
      style={styles.fab}
      color="#FFFFFF"
    />
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: colors.shelfBrown,
  },
});
