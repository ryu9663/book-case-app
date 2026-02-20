import { colors } from '@/lib/theme/colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,

    color: colors.textPrimary,
  },
  countBadge: {
    backgroundColor: 'rgba(85, 139, 47, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  countText: {
    fontSize: 12,
    color: colors.accentGreen,
  },
});
