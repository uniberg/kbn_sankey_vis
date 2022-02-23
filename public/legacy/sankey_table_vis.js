import { i18n } from '@kbn/i18n';
import { AggGroupNames } from '../../../../src/plugins/data/public';
import random from '@fortawesome/fontawesome-free/svgs/solid/random.svg';
import tableVisTemplate from '../legacy/table_vis.html';
import { SankeyOptions } from '../components/sankey_vis_options_lazy';
import { VIS_EVENT_TO_TRIGGER } from '../../../../src/plugins/visualizations/public';

import { SANKEY_VIS_NAME } from '../types';
import { toExpressionAstLegacy } from './to_ast_legacy';


// define the visType object, which kibana will use to display and configure new Vis object of this type.
// eslint-disable-next-line no-unused-vars
export function sankeyVisTypeDefinition (core, context) {
  return {
    requiresSearch: true,
    type: 'table',
    name: SANKEY_VIS_NAME,
    title: i18n.translate('visTypeSankeyVis.visTitle', {
      defaultMessage: 'Sankey Diagram'
    }),
    icon: random,
    description: i18n.translate('visTypeSankeyVis.visDescription', {
      defaultMessage: 'A sankey diagram is a type of flow diagram where flow quantities are depicted by proportional arrow magnitutes.'
    }),
    toExpressionAst: toExpressionAstLegacy,
    getSupportedTriggers: () => {
      return [VIS_EVENT_TO_TRIGGER.filter];
    },
    visConfig: {
      defaults: {
        perPage: 10,
        showPartialRows: false,
        showMetricsAtAllLevels: false,
        sort: {
          columnIndex: null,
          direction: null
        },
        showTotal: false,
        totalFunc: 'sum',
        computedColumns: [],
        computedColsPerSplitCol: false,
        hideExportLinks: false,
        csvExportWithTotal: false,
        stripedRows: false,
        addRowNumberColumn: false,
        csvEncoding: 'utf-8',
        showFilterBar: false,
        filterCaseSensitive: false,
        filterBarHideable: false,
        filterAsYouType: false,
        filterTermsSeparately: false,
        filterHighlightResults: false,
        filterBarWidth: '25%'
      },
      template: tableVisTemplate
    },
    editorConfig: {
      optionsTemplate: SankeyOptions,
      schemas: [
        {
          group: AggGroupNames.Metrics,
          name: 'metric',
          title: i18n.translate('visTypeTable.tableVisEditorConfig.schemas.metricTitle', {
            defaultMessage: 'Metric'
          }),
          aggFilter: ['!geo_centroid', '!geo_bounds'],
          aggSettings: {
            top_hits: {
              allowStrings: true
            }
          },
          min: 1,
          defaults: [{ type: 'count', schema: 'metric' }]
        },
        {
          group: AggGroupNames.Buckets,
          name: 'bucket',
          title: i18n.translate('visTypeTable.tableVisEditorConfig.schemas.bucketTitle', {
            defaultMessage: 'Split rows'
          }),
          aggFilter: ['!filter']
        },
      ]
    },
    hierarchicalData: (vis) => {
      return Boolean(vis.params.showPartialRows || vis.params.showMetricsAtAllLevels);
    }
  };
}
