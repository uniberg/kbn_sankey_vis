const { aggregate } = require('./agg_response_helper');
const { bucketReplaceProperty } = require('./bucket_replace_property_helper');
import { bucketHelper } from './bucket_helper';
import { toastNotifications } from 'ui/notify';

module.exports = function sankeyProvider() {

  return function (vis, resp) {

    // When 'Show missing values' and/or 'Group bucket' is checked then
    // group the inputs in different arrays
    let missingValues = [];
    let groupBucket = [];
    vis.aggs.aggs.forEach((bucket) => {

      if (bucket.params.missingBucket) {
        missingValues = bucketHelper(resp, bucket, bucket.params.missingBucketLabel);

      }
      if (bucket.params.otherBucket) {
        groupBucket = bucketHelper(resp, bucket, bucket.params.otherBucketLabel);
      }
    });

    if (resp.rows.length > 1) {
      if (resp.rows && resp.rows.length > 0) {
        // TODO: Remove Workaround
        // In the new kibana version, the rows are of type object , where they should be of type array to match the rest of the algorithm .
        // This is a workaround to convert the object ( 'col-0-2' : [array]... ) to (0 : [array])
        let newRows = [];
        // The structure of the bucket is as follow: { col-0-1: stri  ng, col-0-2: string... }
        resp.rows.forEach(function(bucket){
          // Cell refers to col-0-1, col-0-2...
          for (let cell in bucket) {
            // Update the bucket if 'Show missing values' is checked
            // by default, the value is '__missing__'
            // kibana/kibana-repo/src/ui/public/agg_types/buckets/terms.js
            if (bucket[cell] === '__missing__') {
              bucketReplaceProperty(missingValues,bucket);
            }
            // Update the bucket if 'Group other bucket' is checked
            if (bucket[cell] === '__other__') {
              bucketReplaceProperty(groupBucket,bucket);
            }
            Object.defineProperty(bucket, cell.split("-")[1],
              Object.getOwnPropertyDescriptor(bucket, cell));
            delete bucket[cell];
          }
          newRows.push(_.values(bucket));
          });
          //end Workaround
          const aggData = newRows;
          return {
            slices: aggregate(aggData)
          };
        } else {
          toastNotifications.addDanger('Empty response.');
          return {
            slices: { nodes: [], links: [] }
          };
        }
    } else {
      toastNotifications.addDanger('Minimum two sub aggs needed.');
      return {
        slices: { nodes: [], links: [] }
      };
    }
  }
}
