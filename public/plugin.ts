import type { CoreSetup, CoreStart, Plugin } from '@kbn/core/public';
import type { Plugin as ExpressionsPublicPlugin } from '@kbn/expressions-plugin/public';
import type { VisualizationsSetup, VisualizationsStart } from '@kbn/visualizations-plugin/public';
import type { FieldFormatsStart } from '@kbn/field-formats-plugin/public';
import { DataViewsPublicPluginStart } from '@kbn/data-views-plugin/public';
import { DataPublicPluginStart } from '@kbn/data-plugin/public';

import { setFormatService, setDataViewsStart, setNotifications, setSearchService, setVisualization } from './services';
import { createSankeyVisLegacyFn } from "./legacy/sankey_vis_legacy_fn";
import { getSankeyVisLegacyRenderer } from "./legacy/sankey_vis_legacy_renderer";
import { tableVisLegacyTypeDefinition } from "./legacy/table_vis_legacy_type";


/** @internal */
export interface SankeyVisPluginSetupDependencies {
  expressions: ReturnType<ExpressionsPublicPlugin['setup']>;
  visualizations: VisualizationsSetup;
}

/** @internal */
export interface SankeyPluginStartDependencies {
  fieldFormats: FieldFormatsStart;
  dataViews: DataViewsPublicPluginStart;
  data: DataPublicPluginStart;
  visualizations: VisualizationsStart;
}

/** @internal */
export class SankeyVisPlugin implements Plugin<void, void, SankeyVisPluginSetupDependencies, SankeyPluginStartDependencies> {

  public async setup(
    core: CoreSetup<SankeyPluginStartDependencies>,
    { expressions, visualizations }: SankeyVisPluginSetupDependencies
  ) {
    expressions.registerFunction(createSankeyVisLegacyFn);
    expressions.registerRenderer(getSankeyVisLegacyRenderer(core));
    visualizations.createBaseVisualization(tableVisLegacyTypeDefinition(core));
  }

  public start(core: CoreStart, { data, dataViews, fieldFormats, visualizations  }: SankeyPluginStartDependencies) {
    setFormatService(fieldFormats);
    setNotifications(core.notifications);
    setSearchService(data.search);
    setDataViewsStart(dataViews);
    setVisualization(visualizations);
  }
}
