import { colors } from '@/lib/theme/colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFCE8',
  },
  scrollContent: {
    padding: 20,
    flexGrow: 1,
  },
  paperSheet: {
    backgroundColor: colors.paper,
    borderRadius: 30,
    padding: 24,
    marginBottom: 24,
    minHeight: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  heading: {
    fontSize: 24,
    color: colors.textPrimary,
    marginBottom: 24,
    textAlign: 'center',

    borderBottomWidth: 1,
    borderBottomColor: 'rgba(132, 204, 22,0.3)',
    paddingBottom: 16,
  },
  input: {
    marginBottom: 8,
    backgroundColor: 'transparent',
    fontSize: 16,
    color: colors.textPrimary,
  },
  contentInput: {
    minHeight: 200,
    lineHeight: 24,
    textAlignVertical: 'top',
  },
  sectionLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 12,
    marginBottom: 8,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.shelfHighlight,
    paddingVertical: 12,
    marginBottom: 8,
  },
  dateButtonText: {
    fontSize: 16,
    lineHeight: 20,
    color: colors.textPrimary,
  },
  pageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  pageInput: {
    flex: 1,
    marginBottom: 0,
  },
  pageSeparator: {
    fontSize: 16,
    color: colors.textMuted,
    marginHorizontal: 12,
  },

  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    backgroundColor: '#8CEE2B',
    borderRadius: 28,
  },
});
