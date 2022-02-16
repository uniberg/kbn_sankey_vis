/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { i18n } from '@kbn/i18n';
import { ExpressionFunctionDefinition, Datatable, Render } from '../../../../src/plugins/expressions/public';
import { sankeyVisLegacyResponseHandler, SankeyContext } from './sankey_vis_legacy_response_handler';
import { SankeyVisConfig, SANKEY_VIS_NAME } from '../types';
export type Input = Datatable;

interface Arguments {
  visConfig: string | null;
}

export interface SankeyVisRenderValue {
  visData: SankeyContext;
  visType: typeof SANKEY_VIS_NAME;
  visConfig: SankeyVisConfig;
}

export type SankeyExpressionFunctionDefinition = ExpressionFunctionDefinition<
  SANKEY_VIS_NAME,
  Input,
  Arguments,
  Render<SankeyVisRenderValue>
>;

export const createSankeyVisLegacyFn = (): SankeyExpressionFunctionDefinition => ({
  name: SANKEY_VIS_NAME,
  type: 'render',
  inputTypes: ['datatable'],
  help: i18n.translate('visTypeTable.function.help', {
    defaultMessage: 'A simple visualization',
  }),
  args: {
    visConfig: {
      types: ['string', 'null'],
      default: '"{}"',
      help: '',
    },
  },
  fn(input, args, { inspectorAdapters}) {
    const visConfig = args.visConfig && JSON.parse(args.visConfig);
    const convertedData = sankeyVisLegacyResponseHandler(input, visConfig.dimensions);

    if (inspectorAdapters?.tables) {
      inspectorAdapters.tables.logDatatable('default', input);
    }
    return {
      type: 'render',
      as: SANKEY_VIS_NAME,
      value: {
        visData: convertedData,
        visType: SANKEY_VIS_NAME,
        visConfig,
      },
    };
  },
});
