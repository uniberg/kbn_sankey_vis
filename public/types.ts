import { ExpressionValueVisDimension } from '@kbn/visualizations-plugin/public';

export const SANKEY_VIS_NAME:VisName = 'sankey';
export type VisName = string;
export interface TableVisConfig extends TableVisParams {
  title: string;
  buckets?: ExpressionValueVisDimension[];
  metrics: ExpressionValueVisDimension[];
  splitColumn?: ExpressionValueVisDimension;
  splitRow?: ExpressionValueVisDimension;
}

export interface TableVisParams {
  perPage: number | '';
  showPartialRows: boolean;
  showMetricsAtAllLevels: boolean;
  showToolbar: boolean;
  showTotal: boolean;
  percentageCol: string;
  row?: boolean;
}




