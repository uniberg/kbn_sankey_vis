/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { SchemaConfig } from '../../../../src/plugins/visualizations/public';
import { Input } from './sankey_vis_legacy_fn';
const { aggregate } = require('./helpers/agg_response_helper');

interface Dimensions {
    buckets: SchemaConfig[];
    metrics: SchemaConfig[];
    splitColumn?: SchemaConfig[];
    splitRow?: SchemaConfig[];
}

export interface SankeyContext {
    tables: Array<TableGroup | Table>;
    direction?: 'row' | 'column';
    slices: any;
}

export interface TableGroup {
    $parent: SankeyContext;
    table: Input;
    tables: Table[];
    title: string;
    name: string;
    key: any;
    column: number;
    row: number;
}

export interface Table {
    $parent?: TableGroup;
    columns: Input['columns'];
    rows: Input['rows'];
}

export function sankeyVisLegacyResponseHandler(table: Input): SankeyContext {
  const converted: SankeyContext = {
    slices: [],
    tables: [],
  };
  converted.tables.push({
    columns: table.columns,
    rows: table.rows,
  });
  const missingValues = [];
  const groupBucket = [];
  table.columns.forEach((bucket) => {

    if (bucket.meta.sourceParams.params.missingBucket) {
      missingValues.push({[bucket.id]: bucket.meta.sourceParams.params.missingBucketLabel});

    }
    if (bucket.meta.sourceParams.params.otherBucket) {
      groupBucket.push({[bucket.id]: bucket.meta.sourceParams.params.otherBucketLabel});
    }
  });
  converted.slices = aggregate({
    rows: table.rows,
    missingValues,
    groupBucket
  });
  return converted;
}


