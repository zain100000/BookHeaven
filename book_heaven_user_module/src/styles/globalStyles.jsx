import {theme} from './theme';
import {StyleSheet} from 'react-native';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
  },

  textPrimary: {
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamilyRegular,
    fontSize: theme.typography.fontSize.md,
  },

  textSecondary: {
    color: theme.colors.secondary,
    fontFamily: theme.typography.fontFamilyRegular,
    fontSize: theme.typography.fontSize.sm,
  },

  textWhite: {
    color: theme.colors.white,
    fontFamily: theme.typography.fontFamilyMedium,
    fontSize: theme.typography.fontSize.sm,
  },

  textGray: {
    color: theme.colors.gray,
    fontFamily: theme.typography.fontFamilyMedium,
    fontSize: theme.typography.fontSize.sm,
  },

  textBlack: {
    color: theme.colors.black,
    fontFamily: theme.typography.fontFamilySemiBold,
    fontSize: theme.typography.fontSize.md,
  },

  textError: {
    color: theme.colors.error,
    fontFamily: theme.typography.fontFamilyMedium,
    fontSize: theme.typography.fontSize.sm,
  },

  buttonPrimary: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing(2),
    paddingHorizontal: theme.spacing(4),
    borderRadius: theme.borderRadius.large,
    alignItems: 'center',
  },

  buttonSecondary: {
    backgroundColor: theme.colors.secondary,
    paddingVertical: theme.spacing(2),
    paddingHorizontal: theme.spacing(4),
    borderRadius: theme.borderRadius.medium,
    alignItems: 'center',
  },

  buttonText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamilyMedium,
    top: 2,
  },

  inputContainer: {
    marginVertical: theme.spacing(1.5),
  },

  input: {
    backgroundColor: theme.colors.white,
    borderWidth: 3,
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.medium,
    paddingVertical: theme.spacing(2.2),
    paddingHorizontal: theme.spacing(4.5),
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamilyRegular,
    color: theme.colors.black,
  },

  inputLabel: {
    fontFamily: theme.typography.fontFamilyMedium,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.black,
  },

  card: {
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing(0.6),
    gap: theme.gap(2),
    ...theme.elevation.depth2,
  },

  cardTitle: {
    fontFamily: theme.typography.fontFamilyMedium,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.black,
    marginBottom: theme.spacing(1),
  },

  cardContent: {
    fontFamily: theme.typography.fontFamilyRegular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.black, // Updated to a valid color from the theme
  },

  divider: {
    height: 1,
    backgroundColor: theme.colors.primary,
    marginVertical: theme.spacing(2),
  },
});
