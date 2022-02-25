import React from 'react';
import { VisEditorOptionsProps } from '../../../../src/plugins/visualizations/public';
import { AggTypes } from '../../../../src/plugins/vis_type_table/common';
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
