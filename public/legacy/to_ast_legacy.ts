
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { buildExpression, buildExpressionFunction, ExpressionAstExpression } from '../../../../src/plugins/expressions/public';
import { getVisSchemas, VisToExpressionAst } from '../../../../src/plugins/visualizations/public';
import { TableVisConfig, SANKEY_VIS_NAME } from '../types';
import { SankeyOptions } from '../components/sankey_options';

export type CommonVisDataParams = SankeyOptions;
export type CommonVisConfig = TableVisConfig;

type CommonVisToExpressionAst = (vis, params, name) => ExpressionAstExpression | Promise<ExpressionAstExpression>;

export const toExpressionAstLegacy: VisToExpressionAst<CommonVisDataParams> = (vis,params) => {
  return toExpressionAst(vis,params,SANKEY_VIS_NAME);
};

const toExpressionAst: CommonVisToExpressionAst = (vis, params, visName) => {

  const schemas = getVisSchemas(vis, params);

  const visConfig: CommonVisConfig = {
    ...vis.params,
    title: vis.title,
  };

  const table = buildExpressionFunction<any>(visName, {
    visConfig: JSON.stringify(visConfig),
    schemas: JSON.stringify(schemas),
    index: vis.data.indexPattern!.id!,
    uiState: JSON.stringify(vis.uiState),
    aggConfigs: JSON.stringify(vis.data.aggs!.aggs),
    partialRows: vis.params.showPartialRows,
    metricsAtAllLevels: vis.isHierarchical()
  });

  const ast = buildExpression([table]);

  return ast.toAst();
};
