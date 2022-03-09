import { PluginInitializerContext, CoreSetup, CoreStart, Plugin } from '../../../src/core/public';
import { VisualizationsSetup, VisualizationsStart } from '../../../src/plugins/visualizations/public';

import { DataPublicPluginStart } from '../../../src/plugins/data/public';
import { setFilterManager, setFormatService, setIndexPatterns, setKibanaLegacy, setNotifications, setQueryService, setSearchService, setVisualization } from './services';
import { KibanaLegacyStart } from '../../../src/plugins/kibana_legacy/public';
import { Plugin as ExpressionsPublicPlugin } from '../../../src/plugins/expressions/public';

/** @internal */
export interface SankeyVisPluginSetupDependencies {
  visualizations: VisualizationsSetup;
  expressions: ReturnType<ExpressionsPublicPlugin['setup']>;
}

/** @internal */
export interface SankeyPluginStartDependencies {
  data: DataPublicPluginStart;
  kibanaLegacy: KibanaLegacyStart;
  visualizations: VisualizationsStart;
}

/** @internal */
export class SankeyVisPlugin implements Plugin<void, void> {
  initializerContext: PluginInitializerContext;

  constructor(initializerContext: PluginInitializerContext) {
    this.initializerContext = initializerContext;
  }

  public async setup(
    core: CoreSetup<SankeyPluginStartDependencies>,
    { visualizations, expressions }: SankeyVisPluginSetupDependencies
  ) {
    const { registerLegacyVis } = await import('./legacy/register_legacy_vis');
    registerLegacyVis(core, { visualizations, expressions }, this.initializerContext);
  }

  public start(core: CoreStart, { data, visualizations, kibanaLegacy  }: SankeyPluginStartDependencies) {
    setFormatService(data.fieldFormats);
    setKibanaLegacy(kibanaLegacy);
    setNotifications(core.notifications);
    setQueryService(data.query);
    setSearchService(data.search);
    setIndexPatterns(data.indexPatterns);
    setFilterManager(data.query.filterManager);
    setVisualization(visualizations);
  }
}
