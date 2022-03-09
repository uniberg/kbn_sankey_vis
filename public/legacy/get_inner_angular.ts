/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

// inner angular imports
// these are necessary to bootstrap the local angular.
// They can stay even after NP cutover
import angular from 'angular';
import 'angular-sanitize';
import 'angular-recursion';
import { CoreStart, IUiSettingsClient } from 'kibana/public';
import { i18nDirective, i18nFilter, I18nProvider } from './angular/i18n';
import { watchMultiDecorator } from './angular/watch_multi';
import { KbnAccessibleClickProvider, PrivateProvider } from './angular/utils';

const thirdPartyAngularDependencies = ['ngSanitize', 'ui.bootstrap', 'RecursionHelper'];

export function getAngularModule(name: string, core: CoreStart) {
  const uiModule = getInnerAngular(name, core);
  return uiModule;
}

let initialized = false;

export function getInnerAngular(name = 'kibana/sankey_vis', core: CoreStart) {
  if (!initialized) {
    createLocalPrivateModule();
    createLocalI18nModule();
    createLocalConfigModule(core.uiSettings);
    createLocalPaginateModule();
    initialized = true;
  }
  return angular
    .module(name, [
      ...thirdPartyAngularDependencies,
      'tableVisPaginate',
      'tableVisConfig',
      'tableVisPrivate',
      'tableVisI18n',
    ])
    .config(['$provide',watchMultiDecorator])
    .directive('kbnAccessibleClick', KbnAccessibleClickProvider);
}

function createLocalPrivateModule() {
  angular.module('tableVisPrivate', []).provider('Private', PrivateProvider);
}

function createLocalConfigModule(uiSettings: IUiSettingsClient) {
  angular.module('tableVisConfig', []).provider('tableConfig', function () {
    return {
      $get: () => ({
        get: (value: string) => {
          return uiSettings ? uiSettings.get(value) : undefined;
        },
        // set method is used in agg_table mocha test
        set: (key: string, value: string) => {
          return uiSettings ? uiSettings.set(key, value) : undefined;
        },
      }),
    };
  });
}

function createLocalI18nModule() {
  angular
    .module('tableVisI18n', [])
    .provider('i18n', I18nProvider)
    .filter('i18n', i18nFilter)
    .directive('i18nId', i18nDirective);
}

function createLocalPaginateModule() {
  angular
    .module('tableVisPaginate', []);
}
