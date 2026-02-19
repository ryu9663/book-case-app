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
    maxHeight: '80%',
  },
  scrollView: {
    flexGrow: 0,
  },
  title: {
    fontSize: 24,
    fontFamily: FONT_FAMILY,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: FONT_FAMILY,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: 20,
  },
  searchInput: {
    marginBottom: 12,
    backgroundColor: colors.paper,
  },
  actionRow: {
    gap: 0,
  },
  actionRowHorizontal: {
    flexDirection: 'row',
    gap: 12,
  },
  searchButton: {
    backgroundColor: colors.shelfDark,
    borderRadius: 24,
    paddingVertical: 2,
  },
  searchButtonTablet: {
    flex: 1,
  },
  searchButtonLabel: {
    fontSize: 15,
    fontFamily: FONT_FAMILY,
    color: colors.warmWhite,
  },
  error: {
    color: colors.error,
    fontSize: 13,
    marginTop: 12,
    textAlign: 'center',
  },
  centerContent: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  resultList: {
    marginTop: 16,
    gap: 8,
  },
  resultItem: {
    backgroundColor: colors.warmWhite,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D7CCC8',
  },
  resultRow: {
    flexDirection: 'row',
    padding: 12,
  },
  thumbnail: {
    width: 50,
    height: 70,
    borderRadius: 4,
  },
  noThumbnail: {
    backgroundColor: colors.shelfHighlight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noThumbnailText: {
    fontSize: 8,
    color: colors.warmWhite,
  },
  resultInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  resultTitle: {
    fontSize: 15,
    fontFamily: FONT_FAMILY,
    color: colors.textPrimary,
  },
  resultAuthor: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  resultPublisher: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  emptyText: {
    fontSize: 15,
    color: colors.textMuted,
  },
  manualButton: {
    marginTop: 12,
    borderColor: colors.shelfBrown,
  },
  manualButtonLabel: {
    color: colors.shelfBrown,
  },
  manualForm: {
    marginTop: 16,
  },
  manualFormTitle: {
    fontSize: 18,
    fontFamily: FONT_FAMILY,
    color: colors.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  manualInput: {
    marginBottom: 12,
    backgroundColor: colors.paper,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  overlayText: {
    color: colors.paper,
    marginTop: 12,
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 16,
    alignSelf: 'center',
  },
  cancelButtonTablet: {
    flex: 1,
    marginTop: 0,
  },
  cancelButtonLabel: {
    fontFamily: FONT_FAMILY,
    color: colors.textMuted,
    fontSize: 14,
  },
});
