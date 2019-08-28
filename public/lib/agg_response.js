// TODO: Remove Workaround
// _array_to_linked_list should be imported from the removed directory 'ui/agg_response/hierarchical/_array_to_linked_list'
const { arrayToLinkedList } = require('./_array_to_linked_list');
const { aggregate } = require('./agg_response_helper');
require('ui/notify');

module.exports = function sankeyProvider(Private, createNotifier) {
  let notify = new createNotifier({
    location: 'Sankey chart response converter'
  });

  return function (vis, resp) {
    let buckets = vis.aggs.bySchemaGroup.buckets;
    if (buckets) {
      buckets = arrayToLinkedList(buckets);
      if (buckets && buckets.length > 1) {
        if (resp.rows && resp.rows.length > 0) {
          // TODO: Remove Workaround
          // In the new kibana version, the rows are of type object , where they should be of type array to match the rest of the algorithm .
          // This is a workaround to convert the object ( 'col-0-2' : [array]... ) to (0 : [array])
          var newRows = [];
          resp.rows.map(function(k,v){
            for ( var property in k ) {
              Object.defineProperty(k, property.split("-")[1],
                  Object.getOwnPropertyDescriptor(k, property));
              delete k[property];
            }
            newRows.push(_.values(k));
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
