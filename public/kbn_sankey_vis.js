  // Kibana Dependencies
  import { npSetup } from 'ui/new_platform';
  import { AngularVisController } from 'ui/vis/vis_types/angular_vis_type';
  import { Schemas } from 'ui/vis/editors/default/schemas';
  import { setup as visualizations } from '../../../src/legacy/core_plugins/visualizations/public/np_ready/public/legacy';

  // Own Dependencies
  import  KbnSankeyVisController from './kbn_sankey_vis_controller'
  import random from '@fortawesome/fontawesome-free/svgs/solid/random.svg';
  import 'plugins/kbn_sankey_vis/kbn_sankey_vis.less';
  import kbnSankeyVisTemplate from 'plugins/kbn_sankey_vis/kbn_sankey_vis.html';

  const sankeyDef = {
      name: 'kbn_sankey',
      title: 'Sankey Diagram',
      image: random,
      description: 'A sankey diagram is a type of flow diagram where flow quantities are depicted by proportional arrow magnitutes.',
      visualization: AngularVisController,
      visConfig: {
        defaults: {
          showMetricsAtAllLevels: false
        },
        template: kbnSankeyVisTemplate
      },
      hierarchicalData: function (vis) {
        return Boolean(vis.params.showPartialRows || vis.params.showMetricsAtAllLevels);
      },
      editorConfig: {
        optionsTemplate: '<vislib-basic-options></vislib-basic-options>',
        schemas: new Schemas([
          {
            group: 'metrics',
            name: 'metric',
            title: 'Split Size',
            min: 1,
            max: 1,
            defaults: [{
              type: 'count',
              schema: 'metric'
            }]
          },
          {
            group: 'buckets',
            name: 'segment',
            title: 'Split Slices',
            aggFilter: '!geohash_grid',
            min: 0,
            max: Infinity
          }
        ])
      },
      requiresSearch: true
    };
  npSetup.plugins.expressions.registerFunction(sankeyDef);
  visualizations.types.createBaseVisualization(sankeyDef);
