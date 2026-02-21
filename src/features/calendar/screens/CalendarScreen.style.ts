import { colors } from '@/lib/theme/colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.3)',
    zIndex: 20,
  },
  headerTitle: {
    fontSize: 22,
    color: colors.shelfBrown,
  },
  scroll: {
    flex: 1,
  },
});
