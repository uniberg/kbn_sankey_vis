import { ExpressionValueVisDimension } from '../../../src/plugins/visualizations/public';
import { IFieldFormat } from '../../../src/plugins/data/public';
import { DatatableColumn, DatatableRow } from '../../../src/plugins/expressions';
import { SchemaConfig } from '../../../src/plugins/visualizations/public';
import { AggTypes } from '../../../src/plugins/vis_type_table/common';
import { TableContext } from '../../../src/plugins/vis_type_table/public/types';
export interface TableVisData {
  table?: TableContext;
  tables: TableGroup[];
  direction?: 'row' | 'column';
}
export const SANKEY_VIS_NAME:VisName = 'sankey';
export type VisName = string;
export interface TableVisConfig extends TableVisParams {
  title: string;
  buckets?: ExpressionValueVisDimension[];
  metrics: ExpressionValueVisDimension[];
  splitColumn?: ExpressionValueVisDimension;
  splitRow?: ExpressionValueVisDimension;
}
export interface Dimensions {
  buckets: SchemaConfig[];
  metrics: SchemaConfig[];
  splitColumn?: SchemaConfig[];
  splitRow?: SchemaConfig[];
}

export interface ColumnWidthData {
  colIndex: number;
  width: number;
}

export interface TableVisUiState {
  sort: {
    columnIndex: number | null;
    direction: 'asc' | 'desc' | null;
  };
  colWidth: ColumnWidthData[];
}

export interface SankeyVisConfig extends TableVisParams {
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
  totalFunc: AggTypes;
  percentageCol: string;
  row?: boolean;
}

export interface FormattedColumn {
  title: string;
  formatter: IFieldFormat;
  formattedTotal?: string | number;
  filterable: boolean;
  sumTotal?: number;
  total?: number;
}

export interface FormattedColumns {
  [key: string]: FormattedColumn;
}

export interface SankeyVisContext {
  columns: DatatableColumn[];
  rows: DatatableRow[];
  formattedColumns: FormattedColumns;
}

export interface TableGroup {
  table: SankeyVisContext;
  title: string;
}

