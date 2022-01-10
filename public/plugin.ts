import { PluginInitializerContext, CoreSetup, CoreStart, AsyncPlugin } from '../../../src/core/public';
import { VisualizationsSetup, VisualizationsStart } from '../../../src/plugins/visualizations/public';

import { DataPublicPluginStart } from '../../../src/plugins/data/public';
import { setFormatService, setNotifications } from './services';
import { KibanaLegacyStart } from '../../../src/plugins/kibana_legacy/public';
import { Plugin as ExpressionsPublicPlugin } from '../../../src/plugins/expressions/public';

interface ClientConfigType {
  legacyVisEnabled: boolean;
}

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
export class SankeyVisPlugin implements AsyncPlugin<void, void, SankeyVisPluginSetupDependencies, SankeyPluginStartDependencies> {
  initializerContext: PluginInitializerContext<ClientConfigType>;

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

  public start(core: CoreStart, { data }: SankeyPluginStartDependencies) {
    setFormatService(data.fieldFormats);
    setNotifications(core.notifications);
  }
}
