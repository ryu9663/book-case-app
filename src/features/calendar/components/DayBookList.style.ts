import { colors } from '@/lib/theme/colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dateHeader: {
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: 16,
  },
  bookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  accentLine: {
    width: 4,
    borderRadius: 2,
    alignSelf: 'stretch',
    marginRight: 10,
  },
  thumbnail: {
    width: 40,
    height: 56,
    borderRadius: 4,
  },
  bookInfo: {
    flex: 1,
    marginLeft: 12,
  },
  bookTitle: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  bookAuthor: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  reviewTitle: {
    fontSize: 13,
    color: colors.shelfBrown,
    marginTop: 6,
  },
  pageRange: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  reviewContent: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  stickerCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});
