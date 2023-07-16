import { buildExpression, buildExpressionFunction, ExpressionAstExpression } from '@kbn/expressions-plugin/public';
import { getVisSchemas, VisToExpressionAst } from '@kbn/visualizations-plugin/public';
import { TableVisConfig, SANKEY_VIS_NAME } from '../types';
import { SankeyVisParams } from '../components/sankey_options';
import { CommonExpressionFunctionDefinition } from './kibana_cloned_code/visualization_fn';

export type CommonVisDataParams = SankeyVisParams;
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

  const table = buildExpressionFunction<CommonExpressionFunctionDefinition>(visName, {
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
