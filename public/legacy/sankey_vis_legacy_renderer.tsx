import { CoreSetup } from '@kbn/core/public';
import { ExpressionRenderDefinition } from '@kbn/expressions-plugin/public';
import { SankeyPluginStartDependencies } from '../plugin';
import { SankeyVisRenderValue } from './sankey_vis_legacy_fn';
import { SANKEY_VIS_NAME, VisName } from '../types';

const tableVisRegistry = new Map<HTMLElement, any>();

export const getSankeyVisLegacyRenderer: (
  core: CoreSetup<SankeyPluginStartDependencies>
) => ExpressionRenderDefinition<SankeyVisRenderValue> = (core) => ({
  ...getVisLegacyRender(core, SANKEY_VIS_NAME)
});

const getVisLegacyRender: (
    core: CoreSetup<SankeyPluginStartDependencies>,
    visName: VisName
) => ExpressionRenderDefinition<SankeyVisRenderValue> = (core, visName) => ({
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
