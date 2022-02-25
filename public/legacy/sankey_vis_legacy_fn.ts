/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
import { get } from 'lodash';
import { i18n } from '@kbn/i18n';
import { ExpressionFunctionDefinition, Render, Datatable } from '../../../../src/plugins/expressions/public';
import { getIndexPatterns, getFilterManager, getSearchService, getVisualization } from '../services';
import { sankeyVisLegacyResponseHandler } from './sankey_vis_legacy_response_handler';
import { sankeyVisLegacyRequestHandler } from './sankey_vis_legacy_request_handler';
import { SANKEY_VIS_NAME, VisName } from '../types';
export type Input = Datatable;

interface Arguments {
  index?: string | null;
  metricsAtAllLevels?: boolean;
  partialRows?: boolean;
  schemas?: string;
  visConfig?: string;
  uiState?: string;
  aggConfigs?: string;
}

export interface SankeyVisRenderValue {
  visType: string;
  visData: object;
  visConfig: object;
  params?: object;
}

export type SankeyExpressionFunctionDefinition = ExpressionFunctionDefinition<
  VisName,
  any,
  Arguments,
  Promise<Render<SankeyVisRenderValue>>
>;

type ResponseHandler = (any) => any;

export const createSankeyVisLegacyFn = (): SankeyExpressionFunctionDefinition => ({
  ...expressionFunction(SANKEY_VIS_NAME,sankeyVisLegacyResponseHandler),
});
export const expressionFunction = (visName: VisName, responseHandler: ResponseHandler): SankeyExpressionFunctionDefinition => ({
  name: visName,
  type: 'render',
  help: i18n.translate('visualizations.functions.visualization.help', {
    defaultMessage: 'Sankey Diagram',
  }),
  args: {
    // TODO: Below `help` keys should be internationalized once this function
    // TODO: is moved to visualizations plugin.
    index: {
      // types: ['string', 'null'],
      types: ['string'],
      default: '',
      help: 'Index',
    },
    metricsAtAllLevels: {
      types: ['boolean'],
      default: false,
      help: 'Metrics levels',
    },
    partialRows: {
      types: ['boolean'],
      default: false,
      help: 'Partial rows',
    },
    schemas: {
      types: ['string'],
      default: '"{}"',
      help: 'Schemas',
    },
    visConfig: {
      types: ['string'],
      default: '"{}"',
      help: 'Visualization configuration',
    },
    uiState: {
      types: ['string'],
      default: '"{}"',
      help: 'User interface state',
    },
    aggConfigs: {
      types: ['string'],
      default: '"{}"',
      help: 'Aggregation configurations',
    },
  },
  async fn(input, args, { inspectorAdapters, getSearchSessionId }) {
    const visConfigParams = args.visConfig ? JSON.parse(args.visConfig) : {};
    const schemas = args.schemas ? JSON.parse(args.schemas) : {};
    const indexPattern = args.index ? await getIndexPatterns().get(args.index) : null;

    const aggConfigsState = args.aggConfigs ? JSON.parse(args.aggConfigs) : [];
    const aggs = indexPattern
      ? getSearchService().aggs.createAggConfigs(indexPattern, aggConfigsState)
      : undefined;
    const visType = getVisualization().get(visName);
    input = await sankeyVisLegacyRequestHandler({
      partialRows: args.partialRows,
      metricsAtAllLevels: args.metricsAtAllLevels,
      visParams: visConfigParams,
      timeRange: get(input, 'timeRange', null),
      query: get(input, 'query', null),
      filters: get(input, 'filters', null),
      inspectorAdapters,
      queryFilter: getFilterManager(),
      aggs,
      forceFetch: true,
      searchSessionId: getSearchSessionId(),
    });


    if (input.columns) {
      // assign schemas to aggConfigs
      input.columns.forEach((column: any) => {
          if (column.aggConfig) {
              column.aggConfig.aggConfigs.schemas = visType.schemas.all;
          }
      });

      Object.keys(schemas).forEach((key) => {
          schemas[key].forEach((i: any) => {
          if (input.columns[i] && input.columns[i].aggConfig) {
              input.columns[i].aggConfig.schema = key;
          }
          });
      });

      // This only works if "inputs.columns" exist, so it makes
      // sense to have it here
      if (inspectorAdapters?.tables) {
        inspectorAdapters.tables.logDatatable('default', input);
      }
    }

    const response = await responseHandler(input);

    return {
      type: 'render',
      as: visName,
      value: {
        visData: response,
        visType: visType.name,
        visConfig: visConfigParams,
      },
    };
  },
});
