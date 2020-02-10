// TODO: Remove Workaround
// _array_to_linked_list should be imported from the removed directory 'ui/agg_response/hierarchical/_array_to_linked_list'
const { arrayToLinkedList } = require('./_array_to_linked_list');
const { aggregate } = require('./agg_response_helper');
const { bucketReplaceProperty } = require('./bucket_replace_property_helper');
require('ui/notify');

module.exports = function sankeyProvider(Private, createNotifier) {
  let notify = new createNotifier({
    location: 'Sankey chart response converter'
  });

  return function (vis, resp) {
    // When 'Show missing values' and/or 'Group bucket' is checked then
    // group the inputs in different arrays
    let missingValues = [];
    let groupBucket = [];
    resp.columns.forEach((bucket) => {
      if(bucket.aggConfig.params.missingBucket) {
        missingValues.push({[bucket.id]: bucket.aggConfig.params.missingBucketLabel});
      }
      if(bucket.aggConfig.params.otherBucket) {
        groupBucket.push({[bucket.id]: bucket.aggConfig.params.otherBucketLabel});
      }
    });
    let buckets = vis.aggs.bySchemaGroup.buckets;
    if (buckets) {
      buckets = arrayToLinkedList(buckets);
      if (buckets && buckets.length > 1) {
        if (resp.rows && resp.rows.length > 0) {
          // TODO: Remove Workaround
          // In the new kibana version, the rows are of type object , where they should be of type array to match the rest of the algorithm .
          // This is a workaround to convert the object ( 'col-0-2' : [array]... ) to (0 : [array])
          var newRows = [];
          // The structure of the bucket is as follow: { col-0-1: string, col-0-2: string... }
          resp.rows.forEach(function(bucket){
          // Cell refers to col-0-1, col-0-2...
            for (let cell in bucket) {
              // Update the bucket if 'Show missing values' is checked
              // by default, the value is '__missing__'
              // kibana/kibana-repo/src/ui/public/agg_types/buckets/terms.js
              if(bucket[cell] === '__missing__') {
                bucketReplaceProperty(missingValues,bucket);
              }
              // Update the bucket if 'Group other bucket' is checked
              if(bucket[cell] === '__other__') {
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
          notify.error('Empty response.');
          return {
            slices: { nodes: [], links: [] }
          };
        }
      } else {
        notify.error('Minimum two sub aggs needed.');
        return {
          slices: { nodes: [], links: [] }
        };
      }

    } else {
      return {
        slices: { nodes: [], links: [] }
      };
    }

  };
};
