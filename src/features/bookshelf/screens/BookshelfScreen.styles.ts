import { StyleSheet } from 'react-native';
import { colors } from '@/lib/theme/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFCE8',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  whiteOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 253, 245, 0.40)',
  },
  // Header
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
    fontFamily: 'GowunDodum_400Regular',
    color: colors.shelfBrown,
  },
  // Scroll Content
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 80,
  },
  subTitle: {
    fontSize: 14,
  },
  rowWrapper: {
    marginBottom: 32,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 22,
    justifyContent: 'center',
  },
  // Add Button
  addButton: {
    width: '100%',
    aspectRatio: 2 / 3.2,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: 'rgba(117, 137, 97,0.4)',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Shelf Plank
  shelfPlank: {
    marginTop: 6,
    marginHorizontal: -8,
  },
  shelfTop: {
    height: 8,
    backgroundColor: 'rgb(226,235,213)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  shelfSide: {
    height: 2,
    backgroundColor: 'rgb(204,215,190)',
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 20,
  },
  footerText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    fontStyle: 'italic',
  },
});
