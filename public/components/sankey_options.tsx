import React, { useEffect, useState } from 'react';
import { VisEditorOptionsProps } from '@kbn/visualizations-plugin/public';
import { EuiFlexItem, EuiCheckbox, EuiCallOut, EuiSpacer } from '@elastic/eui';
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
  dragAndDrop: boolean;
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
  const [checked, setChecked] = useState(false);
  const onChange = (e) => {
    setChecked(e.target.checked);
    setValue('dragAndDrop', e.target.checked)
  };
  useEffect(() => {
    setValidity(isPerPageValid);
  }, [isPerPageValid, setValidity]);
  return (
    <div className="sankey-vis-params">
      <EuiFlexItem>
        { checked ? (<EuiCallOut
          size="s"
          title={`Please note that filtering when clicking on a node will be disabled`}
          iconType="warning"
        />) : undefined }
        <EuiSpacer size="m" />
        <EuiCheckbox
          id={'basicCheckboxId'}
          label="Enable Drag and Drop"
          checked={checked}
          onChange={(e) => onChange(e)}
        />
      </EuiFlexItem>
    </div>
      )

}
// default export required for React.Lazy
// eslint-disable-next-line import/no-default-export
export { SankeyOptions as default };
