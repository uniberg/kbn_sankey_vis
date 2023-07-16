import React, { useEffect } from 'react';
import { VisEditorOptionsProps } from '@kbn/visualizations-plugin/public';
export interface SankeyVisParams {
  type: 'table';
  fieldColumns?: any[];
  linesComputedFilter: string;
  rowsComputedCss: string;
  hiddenColumns: string;
  computedColsPerSplitCol: boolean;
  sortSplitCols: boolean;
  hideExportLinks: boolean;
  csvExportWithTotal: boolean;
  csvFullExport: boolean;
  stripedRows: boolean;
  addRowNumberColumn: boolean;
  csvEncoding: string;

  // Basic Settings
  perPage: number | '';
  showPartialRows: boolean;
  showMetricsAtAllLevels: boolean;
  sort: {
    columnIndex: number | null;
    direction: string | null;
  };
  showTotal: boolean;
  totalLabel: string;

  // Filter Bar
  showFilterBar: boolean;
  filterCaseSensitive: boolean;
  filterBarHideable: boolean;
  filterAsYouType: boolean;
  filterTermsSeparately: boolean;
  filterHighlightResults: boolean;
  filterBarWidth: string;
}
// For the current version of the Sankey Diagram, we do not need any option
// returning a react component is required
function SankeyOptions({
                         aggs,
                         stateParams,
                         setValidity,
                         setValue,
                       }: VisEditorOptionsProps<SankeyVisParams>) {
  const isPerPageValid = stateParams.perPage === '' || stateParams.perPage > 0;
  useEffect(() => {
    setValidity(isPerPageValid);
  }, [isPerPageValid, setValidity]);
  return (
    <div className="sankey-vis-params">
    </div>
      )

}
// default export required for React.Lazy
// eslint-disable-next-line import/no-default-export
export { SankeyOptions as default };
