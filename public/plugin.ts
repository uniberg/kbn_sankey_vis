/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
import { PluginInitializerContext, CoreSetup, CoreStart, AsyncPlugin } from '../../../src/core/public';
import { VisualizationsSetup, VisualizationsStart } from '../../../src/plugins/visualizations/public';

import { DataPublicPluginStart } from '../../../src/plugins/data/public';
import { setFormatService, setNotifications } from './services';
import { KibanaLegacyStart } from '../../../src/plugins/kibana_legacy/public';
import { Plugin as ExpressionsPublicPlugin } from '../../../src/plugins/expressions/public';
import { UsageCollectionSetup } from '../../../src/plugins/usage_collection/public';

interface ClientConfigType {
  legacyVisEnabled: boolean;
}

/** @internal */
export interface SankeyVisPluginSetupDependencies {
  visualizations: VisualizationsSetup;
  expressions: ReturnType<ExpressionsPublicPlugin['setup']>;
  usageCollection: UsageCollectionSetup;
}

/** @internal */
export interface SankeyPluginStartDependencies {
  data: DataPublicPluginStart;
  kibanaLegacy: KibanaLegacyStart;
  visualizations: VisualizationsStart;
}

/** @internal */
export class SankeyVisPlugin implements AsyncPlugin<void, void, SankeyVisPluginSetupDependencies, SankeyPluginStartDependencies> {
  initializerContext: PluginInitializerContext<ClientConfigType>;

  constructor(initializerContext: PluginInitializerContext) {
    this.initializerContext = initializerContext;
  }

  public async setup(
    core: CoreSetup<SankeyPluginStartDependencies>,
    { visualizations, expressions, usageCollection }: SankeyVisPluginSetupDependencies
  ) {
    const { registerLegacyVis } = await import('./legacy/register_legacy_vis');
    registerLegacyVis(core, { visualizations, expressions, usageCollection }, this.initializerContext);
  }

  public start(core: CoreStart, { data }: SankeyPluginStartDependencies) {
    setFormatService(data.fieldFormats);
  }
}
