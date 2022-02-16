/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { Required } from '@kbn/utility-types';
const { aggregate } = require('./agg_response_helper');
import { SchemaConfig } from '../../../../src/plugins/visualizations/public';
import { getFormatService } from '../services';
import { Input } from './sankey_vis_legacy_fn';

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

export function sankeyVisLegacyResponseHandler(table: Input, dimensions: Dimensions): SankeyContext {
  const converted: SankeyContext = {
    slices: [],
    tables: [],
  };

  const split = dimensions.splitColumn || dimensions.splitRow;

  if (split) {
    converted.direction = dimensions.splitRow ? 'row' : 'column';
    const splitColumnIndex = split[0].accessor;
    const splitColumnFormatter = getFormatService().deserialize(split[0].format);
    const splitColumn = table.columns[splitColumnIndex];
    const splitMap: Record<string, number> = {};
    let splitIndex = 0;

    table.rows.forEach((row, rowIndex) => {
      const splitValue = row[splitColumn.id];

      if (!splitMap.hasOwnProperty(splitValue)) {
        splitMap[splitValue] = splitIndex++;
        const tableGroup: Required<TableGroup, 'tables'> = {
          $parent: converted,
          title: `${splitColumnFormatter.convert(splitValue)}: ${splitColumn.name}`,
          name: splitColumn.name,
          key: splitValue,
          column: splitColumnIndex,
          row: rowIndex,
          table,
          tables: [],
        };

        tableGroup.tables.push({
          $parent: tableGroup,
          columns: table.columns,
          rows: [],
        });

        converted.tables.push(tableGroup);
      }

      const tableIndex = splitMap[splitValue];
      (converted.tables[tableIndex] as TableGroup).tables[0].rows.push(row);
    });
  } else {
    converted.tables.push({
      columns: table.columns,
      rows: table.rows,
    });
  }
  let missingValues = [];
  let groupBucket = [];
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
    missingValues: missingValues,
    groupBucket:groupBucket
  });
  return converted;
}
