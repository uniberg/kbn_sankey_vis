const { aggregate } = require('./agg_response_helper');
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
        return {
            slices: aggregate({
              rows: resp.rows,
              missingValues,
              groupBucket
            })
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
