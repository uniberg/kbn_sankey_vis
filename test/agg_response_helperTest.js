const assert = require('assert');

const stringify = require('json-stable-stringify');
const aggResponseHelper = require('../public/lib/agg_response_helper');

describe('aggResponseHelper', function() {
  describe('aggregate', function() {
    it('should create nodes and links array', function() {
      const data = [
        [ 'node0', 'node3', 'node2', 90 ],
        [ 'node0', 'node2', 'node1', 90 ],
        [ 'node1', 'node3', 'node5', 90 ],
        [ 'node1', 'node4', 'node2', 90 ]
      ];
      const expected_nodes = [
        { name: 'node0' },
        { name: 'node1' },
        { name: 'node1' },
        { name: 'node2' },
        { name: 'node2' },
        { name: 'node3' },
        { name: 'node4' },
        { name: 'node5' }
      ];
      const expected_links = [
        { source: 0, target: 5, value: 90 },
        { source: 5, target: 4, value: 90 },
        { source: 0, target: 3, value: 90 },
        { source: 3, target: 2, value: 90 },
        { source: 1, target: 5, value: 90 },
        { source: 5, target: 5, value: 90 },
        { source: 1, target: 5, value: 90 },
        { source: 0, target: 5, value: 90 },
      ];
      const result = aggResponseHelper.aggregate(data); 
      const result_nodes = result.nodes;
      const result_links = result.links;
      assert.notStrictEqual(result_nodes, expected_nodes);
    });

    it('should sum link values', function() {
      const data = [
        [ 'node0', 'node1', 90 ],
        [ 'node0', 'node1', 90 ],
        [ 'node2', 'node1', 90 ]
      ];
      const expected_links = [
        { source: 0, target: 1, value: 180 },
        { source: 2, target: 1, value: 90 }
      ];
      const result = aggResponseHelper.aggregate(data);
      const result_links = result.links;
      assert.notStrictEqual(result_links, expected_links);
    });

    it('should be possible to use the same node name in different layers', function() {
      const data = [
        [ 'node0', 'node0', 'node0', 90 ],
        [ '', '', '', 90 ]
      ];
      const expected_nodes = [
        { name: '' },
        { name: '' },
        { name: '' },
        { name: 'node0' },
        { name: 'node0' },
        { name: 'node0' }
      ];
      const result = aggResponseHelper.aggregate(data); 
      const result_nodes = result.nodes;
      assert.notStrictEqual(result_nodes, expected_nodes);
    });
  });

  describe('privateFkt_generateRefNodesIdMap', function() {
    it('should create nodes in the right order', function() {
      /*
       * n0 - n3 - n2
       * n1 - n2 - n1
       */
      const data = [
        [ 'node0', 'node3', 'node2', 90 ],
        [ 'node1', 'node2', 'node1', 90 ]
      ];
      const nodesMap = new Map();
      nodesMap.set(stringify({"layerIndex":0,"nodeName":"node0"}), 'node0');
      nodesMap.set(stringify({"layerIndex":1,"nodeName":"node3"}), 'node3');
      nodesMap.set(stringify({"layerIndex":2,"nodeName":"node2"}), 'node2');
      nodesMap.set(stringify({"layerIndex":0,"nodeName":"node1"}), 'node1');
      nodesMap.set(stringify({"layerIndex":1,"nodeName":"node2"}), 'node2');
      nodesMap.set(stringify({"layerIndex":2,"nodeName":"node1"}), 'node1');
       
      const result = aggResponseHelper._generateSortedNodeArray(nodesMap);
      //console.log('RESULT: ',result);
    });
  });

  describe('privateFkt_generateLinksMap', function() {});
});
