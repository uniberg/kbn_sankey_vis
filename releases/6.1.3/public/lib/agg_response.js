import _ from 'lodash';

import { arrayToLinkedList } from 'ui/agg_response/hierarchical/_array_to_linked_list';

module.exports = function sankeyProvider(Private, Notifier) {

  let notify = new Notifier({
    location: 'Sankey chart response converter'
  });

  let nodes = {};
  let links = {};
  let index = 0;

  function groupByColumn(data, columnId) {
    data.map((row) => {
      const elem = row[columnId];
      if (!nodes[elem] && nodes[elem] !== 0) {
        nodes[elem] = index;
        index++;
      }
    });
  }

  function initializeNodes(data) {
    const columnCount = data[0].length; 
    for (let i = 0; i < columnCount - 1; i++) {
      groupByColumn(data, i);
    }
  }

  function createLinks(row) {  
    const columnCount = row.length - 1;
    for (let i = 0; i < columnCount - 1; i++) {
      const srcElem = row[i];
      const tarElem = row[i + 1];
      const srcId = nodes[srcElem];
      const tarId = nodes[tarElem];
      const elem = srcId + 'sankeysplitchar' + tarId;
      links[elem] = row[columnCount];
    }
  }

  function processEntry(data) {
    initializeNodes(data);

    data.map((row) => createLinks(row)); 
  }

  return function (vis, resp) {

    let chart = {};

    if (vis.aggs && vis.aggs.bySchemaGroup.buckets && vis.aggs.bySchemaGroup.buckets.length > 0) {
      let buckets = vis.aggs.bySchemaGroup.buckets;
      buckets = arrayToLinkedList(buckets);

      if (!buckets) {
        return {
          'slices': {
            'nodes': [],
            'links': []
          }
        };
      } else {
        let firstAgg = buckets[0];
        let aggData = resp.tables[0].rows;

        if (!firstAgg._next) {
          notify.error('need more than one sub aggs');
        }

        nodes = {};
        links = {};
        index = 0;

        processEntry(aggData);

        let invertNodes = _.invert(nodes);
        chart = {
          'slices': {
            'nodes': _.map(_.keys(invertNodes), function (k) {
              return {
                'name': invertNodes[k]
              };
            }),
            'links': _.map(_.keys(links), function (k) {
              let s = k.split('sankeysplitchar');
              return {
                'source': parseInt(s[0]),
                'target': parseInt(s[1]),
                'value': links[k]
              };
            })
          }
        };
      }
    }

    return chart;
  };
};
