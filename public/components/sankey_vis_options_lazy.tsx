/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

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
