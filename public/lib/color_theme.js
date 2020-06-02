import color from 'color';
import { getUISettings } from '../../../../src/legacy/core_plugins/visualizations/public/np_ready/public/services';

const isDarkTheme = () => getUISettings().get('theme:darkMode');
const lightTextColor = "#CBCFCB";
const darkTextColor = "#000000";

/**
 * Returns true if the color that is passed has low luminosity
 */
const isColorDark = (c) => {
  return color(c).luminosity() < 0.45;
};

/**
 * Checks to see if the `currentTheme` is dark in luminosity.
 * Defaults to checking `theme:darkMode`.
 */
export const isThemeDark = (currentTheme) => {
  let themeIsDark = currentTheme || isDarkTheme();

  // If passing a string, check the luminosity
  if (typeof currentTheme === 'string') {
    themeIsDark = isColorDark(currentTheme);
  }

  return themeIsDark;
};

/**
 * Checks to find if the ultimate `backgroundColor` is dark.
 * Defaults to returning if the `currentTheme` is dark.
 */
export const isBackgroundDark = (backgroundColor, currentTheme) => {
  const themeIsDark = isThemeDark(currentTheme);

  // If a background color doesn't exist or it inherits, pass back if it's a darktheme
  if (!backgroundColor || backgroundColor === 'inherit') {
    return themeIsDark;
  }

  // Otherwise return if the background color has low luminosity
  return isColorDark(backgroundColor);
};

/**
 * Checks to see if `backgroundColor` is the the same lightness spectrum as `currentTheme`.
 */
export const isBackgroundInverted = (backgroundColor, currentTheme) => {
  const backgroundIsDark = isBackgroundDark(backgroundColor, currentTheme);
  const themeIsDark = isThemeDark(currentTheme);
  return backgroundIsDark !== themeIsDark;
};

/**
 * Return an appropriate text color for the given `backgroundColor` and `currentTheme`
 */
export const appropriateTextColor = (backgroundColor, currentTheme) => {
  return (isBackgroundDark(backgroundColor, currentTheme)) ? lightTextColor : darkTextColor;
};
