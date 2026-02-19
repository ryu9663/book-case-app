import { StyleSheet } from 'react-native';

import { colors } from '@/lib/theme/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.contentBg,
  },
  header: {
    backgroundColor: 'transparent',
    elevation: 0,
  },
  headerTitle: {
    color: colors.shelfBrown,
    fontWeight: '700',
    fontSize: 20,
    textAlign: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  coverBackground: {
    alignSelf: 'center',
    backgroundColor: '#B8C5A3',
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 40,
    alignItems: 'center',
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  bookTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  bookAuthor: {
    fontSize: 15,
    color: colors.textMuted,
    marginTop: 4,
  },
  readingStatusText: {
    fontSize: 13,
    color: colors.accentGreen,
    fontWeight: '600',
    marginTop: 12,
    letterSpacing: 0.5,
  },
  reviewSection: {
    marginTop: 0,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    backgroundColor: '#8CEE2B',
    borderRadius: 28,
  },
});
