import { ExpressionFunctionDefinition, Render } from '@kbn/expressions-plugin/public';
import { VisName } from '../../types';

interface Arguments {
  index?: string | null;
  metricsAtAllLevels?: boolean;
  partialRows?: boolean;
  schemas?: string;
  visConfig?: string;
  uiState?: string;
  aggConfigs?: string;
  timeFields?: string[];
}

export interface CommonVisRenderValue {
    visType: string;
    visData: object;
    visConfig: object;
    params?: object;
  }

export type CommonExpressionFunctionDefinition = ExpressionFunctionDefinition<
  VisName,
  any,
  Arguments,
  Promise<Render<CommonVisRenderValue>>
>;
