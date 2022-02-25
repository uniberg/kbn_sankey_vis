import { CoreSetup, PluginInitializerContext } from 'kibana/public';
import { ExpressionRenderDefinition } from '../../../../src/plugins/expressions';
import { SankeyPluginStartDependencies } from '../plugin';
import { SankeyVisRenderValue } from './sankey_vis_legacy_fn';
import { SANKEY_VIS_NAME, VisName } from '../types';

const tableVisRegistry = new Map<HTMLElement, any>();

export const getSankeyVisLegacyRenderer: (
  core: CoreSetup<SankeyPluginStartDependencies>,
  context: PluginInitializerContext
) => ExpressionRenderDefinition<SankeyVisRenderValue> = (core, context) => ({
  ...getVisLegacyRender(core, context, SANKEY_VIS_NAME)
});

const getVisLegacyRender: (
    core: CoreSetup<SankeyPluginStartDependencies>,
    context: PluginInitializerContext,
    visName: VisName
) => ExpressionRenderDefinition<SankeyVisRenderValue> = (core, context, visName) => ({
  name: visName,
  reuseDomNode: true,
  render: async (domNode, config, handlers) => {
    let registeredController = tableVisRegistry.get(domNode);

    if (!registeredController) {
      const { getTableVisualizationControllerClass } = await import('./vis_controller');

      const Controller = getTableVisualizationControllerClass(core);
      registeredController = new Controller(domNode, config.visType);
      tableVisRegistry.set(domNode, registeredController);

      handlers.onDestroy(() => {
        registeredController?.destroy();
        tableVisRegistry.delete(domNode);
      });
    }

    await registeredController.render(config.visData, config.visConfig, handlers);
    handlers.done();
  },
});
