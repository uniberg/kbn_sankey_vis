import React, { Suspense, lazy } from 'react';
import { EuiLoadingSpinner } from '@elastic/eui';
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
  dragAndDrop: boolean;
  percentageCol: string;
  row?: boolean;
}
const SankeyOptionsComponent = lazy(() => import('./sankey_options'));

export const SankeyOptions = (props: VisEditorOptionsProps<TableVisParams>) => (
  <Suspense fallback={<EuiLoadingSpinner />}>
    <SankeyOptionsComponent {...props} />
  </Suspense>
);
