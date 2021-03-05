/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

const { aggregate } = require('./agg_response_helper');
import { bucketHelper } from './bucket_helper';
import { getNotifications } from '../services';
export function sankeyProvider(resp) {
  // When 'Show missing values' and/or 'Group bucket' is checked then
  // group the inputs in different arrays
  let missingValues = [];
  let groupBucket = [];
  resp.aggs.aggs.forEach((bucket) => {

    if (bucket.params.missingBucket) {
      missingValues.push({[bucketHelper(resp, bucket, bucket.params.missingBucketLabel).id]: bucket.params.missingBucketLabel});

    }
    if (bucket.params.otherBucket) {
      groupBucket.push({[bucketHelper(resp, bucket, bucket.params.otherBucket).id]: bucket.params.otherBucketLabel});
    }
  });

  if (resp.columns.length > 2) {
    if (resp.rows && resp.rows.length > 0) {
      return {
        slices: aggregate({
          rows: resp.rows,
          missingValues,
          groupBucket
        }), totalHits: resp.totalHits, aggs: resp.aggs, newResponse: true
      };
    } else {
      return {
        slices: { nodes: [], links: [] }, totalHits: resp.totalHits, aggs: resp.aggs, newResponse: true
      };
    }
  } else {
    getNotifications().toasts.addWarning({title: 'Warning', text: 'Minimum two sub aggs needed.'});
    return {
      slices: { nodes: [], links: [] }, totalHits: resp.totalHits, aggs: resp.aggs, newResponse: true
    };
  }
}
