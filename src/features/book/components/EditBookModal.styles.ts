import { StyleSheet } from 'react-native';
import { colors } from '@/lib/theme/colors';

const FONT_FAMILY = 'GowunDodum_400Regular';

export const styles = StyleSheet.create({
  dimOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: 'rgb(255,253,245)',
    borderRadius: 16,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: FONT_FAMILY,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 12,
    backgroundColor: colors.paper,
  },
  actionRow: {
    marginTop: 8,
    gap: 0,
  },
  saveButton: {
    backgroundColor: colors.shelfDark,
    borderRadius: 24,
    paddingVertical: 2,
  },
  saveButtonLabel: {
    fontSize: 15,
    fontFamily: FONT_FAMILY,
    color: colors.warmWhite,
  },
  cancelButton: {
    marginTop: 16,
    alignSelf: 'center',
  },
  cancelButtonLabel: {
    fontFamily: FONT_FAMILY,
    color: colors.textMuted,
    fontSize: 14,
  },
});
