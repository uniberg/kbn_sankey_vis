const { arrayToLinkedList } = require('./_array_to_linked_list');
const { aggregate } = require('./agg_response_helper');

module.exports = function sankeyProvider(Private, Notifier) {
  let notify = new Notifier({
    location: 'Sankey chart response converter'
  });

  return function (vis, resp) {
    let buckets = vis.aggs.bySchemaGroup.buckets;
    buckets = arrayToLinkedList(buckets);
    if (buckets && buckets.length > 1) {
      if (resp.rows && resp.rows.length > 0) {
        var newRows = [];
          resp.rows.map(function(k,v){
            for ( var property in k ) {
                Object.defineProperty(k, property.split("-")[1],
                        Object.getOwnPropertyDescriptor(k, property));
                delete k[property];
            }
            newRows.push(_.values(k));
            });
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
      let firstAgg = buckets[0];
      if (!firstAgg._next) {
        notify.warning('Minimum two sub aggs needed.');
      }
      return {
        slices: { nodes: [], links: [] }
      };
    }
  };
};
