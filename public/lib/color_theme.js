/*
 * Adapted from Kibana's set_is_reversed.js
 * (originally at https://github.com/elastic/kibana/blob/bf04235/
 *    src/plugins/vis_type_timeseries/public/application/lib/set_is_reversed.js)
 * for use in kbn_sankey_vis plugin.
 *
 * Kibana's original license terms for set_is_reversed.js are as follows:
 *
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

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
