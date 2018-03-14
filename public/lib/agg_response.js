const { arrayToLinkedList } = require('ui/agg_response/hierarchical/_array_to_linked_list');
const { aggregate } = require('./agg_response_helper');

module.exports = function sankeyProvider(Private, Notifier) {
  let notify = new Notifier({
    location: 'Sankey chart response converter'
  });

  return function (vis, resp) {
    let buckets = vis.aggs.bySchemaGroup.buckets;
    buckets = arrayToLinkedList(buckets);

    if (buckets && buckets.length > 1) {
      if (resp.tables && resp.tables.length > 0 && resp.tables[0].rows) {
        const aggData = resp.tables[0].rows;
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
