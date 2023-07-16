import React from 'react';
import { VisEditorOptionsProps } from '@kbn/visualizations-plugin/public';

export enum AggTypes {
  SUM = 'sum',
  AVG = 'avg',
  MIN = 'min',
  MAX = 'max',
  COUNT = 'count',
}
interface TableVisParams {
  perPage: number | '';
  showPartialRows: boolean;
  showMetricsAtAllLevels: boolean;
  showToolbar: boolean;
  showTotal: boolean;
  totalFunc: AggTypes;
  percentageCol: string;
  row?: boolean;
}

export const SankeyOptions = (props: VisEditorOptionsProps<TableVisParams>) => (
  <></>
);
