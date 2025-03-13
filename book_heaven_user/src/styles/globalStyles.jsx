import {theme} from './theme';
import {StyleSheet, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('screen');

// Responsive scaling functions
const scale = size => width * (size / 375); // Base width iPhone 12/13
const verticalScale = size => height * (size / 812); // Base height iPhone 12/13
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
  },

  textPrimary: {
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamilyRegular,
    fontSize: moderateScale(theme.typography.fontSize.md),
  },

  textSecondary: {
    color: theme.colors.secondary,
    fontFamily: theme.typography.fontFamilyRegular,
    fontSize: moderateScale(theme.typography.fontSize.md),
  },

  textWhite: {
    color: theme.colors.white,
    fontFamily: theme.typography.fontFamilyMedium,
    fontSize: moderateScale(theme.typography.fontSize.md),
  },

  textBlack: {
    color: theme.colors.black,
    fontFamily: theme.typography.fontFamilySemiBold,
    fontSize: moderateScale(theme.typography.fontSize.md),
  },

  textError: {
    color: theme.colors.error,
    fontFamily: theme.typography.fontFamilyMedium,
    fontSize: moderateScale(theme.typography.fontSize.md),
  },

  buttonPrimary: {
    backgroundColor: theme.colors.white,
    paddingVertical: verticalScale(theme.spacing(2)),
    paddingHorizontal: scale(theme.spacing(4)),
    borderRadius: moderateScale(theme.borderRadius.large),
    alignItems: 'center',
    minWidth: width * 0.4,
    minHeight: height * 0.06,
  },

  buttonSecondary: {
    backgroundColor: theme.colors.secondary,
    paddingVertical: verticalScale(theme.spacing(2)),
    paddingHorizontal: scale(theme.spacing(4)),
    borderRadius: moderateScale(theme.borderRadius.medium),
    alignItems: 'center',
    minWidth: width * 0.4,
    minHeight: height * 0.06,
  },

  buttonText: {
    color: theme.colors.white,
    fontSize: moderateScale(theme.typography.fontSize.md),
    fontFamily: theme.typography.fontFamilyMedium,
    top: verticalScale(2),
  },

  inputContainer: {
    marginVertical: verticalScale(theme.spacing(1.5)),
  },

  input: {
    backgroundColor: theme.colors.white,
    borderWidth: moderateScale(3),
    borderColor: theme.colors.primary,
    borderRadius: moderateScale(theme.borderRadius.large),
    paddingVertical: verticalScale(theme.spacing(1.6)),
    paddingHorizontal: scale(theme.spacing(4.5)),
    fontSize: moderateScale(theme.typography.fontSize.md),
    fontFamily: theme.typography.fontFamilyRegular,
    color: theme.colors.black,
    minHeight: height * 0.06,
  },

  inputLabel: {
    fontFamily: theme.typography.fontFamilyMedium,
    fontSize: moderateScale(theme.typography.fontSize.md),
  },

  card: {
    borderRadius: moderateScale(theme.borderRadius.medium),
    padding: moderateScale(theme.spacing(0.6)),
    gap: verticalScale(theme.gap(2)),
    shadowColor: theme.colors.black,
    shadowOffset: {width: scale(0), height: verticalScale(2)},
    shadowOpacity: 0.3,
    shadowRadius: moderateScale(7),
    elevation: 6,
    minWidth: width * 0.8,
    marginHorizontal: scale(8),
  },

  cardTitle: {
    fontFamily: theme.typography.fontFamilyMedium,
    fontSize: moderateScale(theme.typography.fontSize.lg),
    color: theme.colors.black,
    marginBottom: verticalScale(theme.spacing(1)),
  },

  cardContent: {
    fontFamily: theme.typography.fontFamilyRegular,
    fontSize: moderateScale(theme.typography.fontSize.md),
    color: theme.colors.textPrimary,
    lineHeight: moderateScale(20),
  },

  divider: {
    height: verticalScale(1),
    backgroundColor: theme.colors.primary,
    marginVertical: verticalScale(theme.spacing(2)),
  },
});
