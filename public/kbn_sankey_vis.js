/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { i18n } from '@kbn/i18n';
import { AggGroupNames } from '../../../src/plugins/data/public';
import { Schemas } from '../../../src/plugins/vis_default_editor/public';

import sankeyTemplate from './kbn_sankey_vis.html';
import { getSankeyVisualizationController } from './vis_controller';
import { requestHandler } from './lib/request-handler';
import { sankeyProvider } from './lib/agg_response';
import { SankeyOptions } from './components/sankey_options';
import { VIS_EVENT_TO_TRIGGER } from '../../../src/plugins/visualizations/public';
import random from '@fortawesome/fontawesome-free/svgs/solid/random.svg';

// define the visType object, which kibana will use to display and configure new Vis object of this type.
export function sankeyTypeDefinition (core, context) {
  return {
    name: 'kbn_sankey',
    title: i18n.translate('visTypeSankey.visTitle', {
      defaultMessage: 'Sankey Diagram'
    }),
    image: random,
    description: i18n.translate('visTypeSankey.visDescription', {
      defaultMessage: 'A sankey diagram is a type of flow diagram where flow quantities are depicted by proportional arrow magnitutes.'
    }),
    visualization: getSankeyVisualizationController(core, context),
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
      template: sankeyTemplate
    },
    editorConfig: {
      optionsTemplate: SankeyOptions,
      schemas: new Schemas([
        {
          group: AggGroupNames.Metrics,
          name: 'metric',
          title: i18n.translate('visType.VisEditorConfig.schemas.metricTitle', {
            defaultMessage: 'Metric'
          }),
          aggSettings: {
            top_hits: {
              allowStrings: true
            }
          },
          min: 1,
          max: 1,
          defaults: [{ type: 'count', schema: 'metric' }]
        },
        {
          group: AggGroupNames.Buckets,
          name: 'bucket',
          title: i18n.translate('visType.VisEditorConfig.schemas.bucketTitle', {
            defaultMessage: 'Split rows'
          }),
          min: 0,
        },
      ])
    },
    requestHandler: requestHandler,
    responseHandler: sankeyProvider,
    hierarchicalData: (vis) => {
      return Boolean(vis.params.showPartialRows || vis.params.showMetricsAtAllLevels);
    }
  };
}
