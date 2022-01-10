/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { PluginInitializerContext, CoreSetup } from 'kibana/public';

import { SankeyVisPluginSetupDependencies, SankeyPluginStartDependencies } from '../plugin';
import { createSankeyVisLegacyFn } from './sankey_vis_legacy_fn';
import { getSankeyVisLegacyRenderer } from './sankey_vis_legacy_renderer';
import { tableVisLegacyTypeDefinition } from './table_vis_legacy_type';

export const registerLegacyVis = (
  core: CoreSetup<SankeyPluginStartDependencies>,
  { expressions, visualizations }: SankeyVisPluginSetupDependencies,
  context: PluginInitializerContext
) => {
  expressions.registerFunction(createSankeyVisLegacyFn);
  expressions.registerRenderer(getSankeyVisLegacyRenderer(core, context));
  visualizations.createBaseVisualization(tableVisLegacyTypeDefinition);
};
