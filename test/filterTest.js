var assert = require('assert');

var filter = require('../public/lib/filter');
describe('filter', function() {
  describe('filterNodesAndLinks()', function() {
    it('should filter all empty links and corresponding nodes', function() {
      nodes = [{ name: 'name_0' }, { name: 'name_1'}, { name: 'name_2' }];
      links = [
        { source: 0, target: 1, value: 0 },
        { source: 0, target: 2, value: 90 }
      ];

      result = filter.filterNodesAndLinks(nodes, links);
      result_nodes = result.nodes;
      result_links = result.links;
      assert.equal(result_nodes.length, 2);
      assert.equal(result_links.length, 1);
    });

    it('should filter out everything', function() {
      nodes = [{ name: 'name_0' }, { name: 'name_1'}, { name: 'name_2' }];
      links = [
        { source: 0, target: 1, value: 0 },
      ];

      result = filter.filterNodesAndLinks(nodes, links);
      result_nodes = result.nodes;
      result_links = result.links;
      assert.equal(result_nodes.length, 0);
      assert.equal(result_links.length, 0);
    });

    it('should filter out nothing', function() {
      nodes = [{ name: 'name_0' }, { name: 'name_1'}, { name: 'name_2' }];
      links = [
        { source: 0, target: 1, value: 10 },
        { source: 0, target: 2, value: 20 },
      ];

      result = filter.filterNodesAndLinks(nodes, links);
      result_nodes = result.nodes;
      result_links = result.links;
      assert.equal(result_nodes.length, 3);
      assert.equal(result_links.length, 2);
    });

    it('should filter out nothing, node name is not unique', function() {
      nodes = [{ name: 'name_0' }, { name: 'name_0'}, { name: 'name_2' }];
      links = [
        { source: 0, target: 1, value: 10 },
        { source: 0, target: 2, value: 20 },
      ];

      result = filter.filterNodesAndLinks(nodes, links);
      result_nodes = result.nodes;
      result_links = result.links;
      assert.equal(result_nodes.length, 3);
      assert.equal(result_links.length, 2);
    });

    it('should filter out invalid values: empty string', function() {
      nodes = [{ name: 'name_0' }, { name: 'name_1'}, { name: 'name_2' }];
      links = [
        { source: 0, target: 1, value: "" },
        { source: 0, target: 2, value: 20 },
      ];

      result = filter.filterNodesAndLinks(nodes, links);
      result_nodes = result.nodes;
      result_links = result.links;
      assert.equal(result_nodes.length, 2);
      assert.equal(result_links.length, 1);
    });

    it('should filter out invalid values: undefined', function() {
      nodes = [{ name: 'name_0' }, { name: 'name_1'}, { name: 'name_2' }];
      links = [
        { source: 0, target: 1, value: undefined },
        { source: 0, target: 2, value: 20 },
      ];

      result = filter.filterNodesAndLinks(nodes, links);
      result_nodes = result.nodes;
      result_links = result.links;
      assert.equal(result_nodes.length, 2);
      assert.equal(result_links.length, 1);
    });

    it('should filter out links of undifined nodes', function() {
      nodes = [{ name: 'name_0' }, { name: 'name_1'}, { name: 'name_2' }];
      links = [
        { source: 0, target: 1, value: 90 },
        { source: 0, target: 3, value: 20 },
      ];

      result = filter.filterNodesAndLinks(nodes, links);
      result_nodes = result.nodes;

      result_links = result.links;
      assert.equal(result_nodes.length, 2);
      assert.equal(result_links.length, 1);
    });

    it('should not filter out nodes with empty names', function() {
      nodes = [{ name: '' }, { name: 'name_1'}, { name: 'name_2' }];
      links = [
        { source: 0, target: 1, value: 90 },
        { source: 0, target: 2, value: 20 },
      ];

      result = filter.filterNodesAndLinks(nodes, links);
      result_nodes = result.nodes;
      result_links = result.links;
      assert.equal(result_nodes.length, 3);
      assert.equal(result_links.length, 2);
    });
  });

  describe('privateFkt_isNodeExists()', function() {
    it('should exist', function() {
      nodes = [{ name: 'node_0' }];
      result = filter._isNodeExist(nodes, 0); 
      assert.ok(result, 'Node index not found');
    }); 

    it('should not exist 1', function() {
      nodes = [{ name: 'node_0' }];
      result = filter._isNodeExist(nodes, 1); 
      assert.equal(result, false, 'Node index found, but it should not.');
    }); 

    it('should not exist 2', function() {
      nodes = [{ name: 'node_0' }];
      result = filter._isNodeExist(nodes, -1); 
      assert.equal(result, false, 'Node index found, but it should not.');
    }); 
  });

  describe('privateFkt_getNode()', function() {
    it('should return a node', function() {
      node = { name: 'node_0' };
      nodesMap = new Map();
      nodesMap.set(0,node);
      result = filter._getNode(nodesMap, 0); 
      assert.equal(result, node, 'Node not found');
    }); 

    it('should return an empty object 1', function() {
      node = { name: 'node_0' };
      nodesMap = new Map();
      nodesMap.set(0,node);
      result = filter._getNode(nodesMap, 1); 
      assert.notStrictEqual(result, {}, 'Node found');
    }); 

    it('should return an empty object 2', function() {
      node = { name: 'node_0' };
      nodesMap = new Map();
      nodesMap.set(0,node);
      result = filter._getNode(nodesMap, -1); 
      assert.notStrictEqual(result, {}, 'Node found');
    }); 
  });

  describe('privateFkt_markUsedNodes()', function() {
    it('should generate nodes map with all nodes valid', function() {
      nodes = [{ name: 'node_0' }, { name: 'node_1' }, { name: 'node_2' }];
      links = [
        { source: 0, target: 1, value: 90 },
        { source: 0, target: 2, value: 90 },
      ];
      nodesMap = new Map();
      nodesMap.set(0,nodes[0]);
      nodesMap.set(1,nodes[1]);
      nodesMap.set(2,nodes[2]);

      filter._markUsedNodes(nodesMap, links);
      result_node0_name = nodesMap.get(0).name;
      result_node1_name = nodesMap.get(1).name;
      result_node2_name = nodesMap.get(2).name;
      result_node0_valid = nodesMap.get(0).valid;
      result_node1_valid = nodesMap.get(1).valid;
      result_node2_valid = nodesMap.get(2).valid;
      assert.equal(result_node0_name, nodes[0].name);
      assert.equal(result_node1_name, nodes[1].name);
      assert.equal(result_node2_name, nodes[2].name);
      assert.equal(result_node0_valid, true);
      assert.equal(result_node1_valid, true);
      assert.equal(result_node2_valid, true);
    });

    it('should generate nodes map with link including null value', function() {
      nodes = [{ name: 'node_0' }, { name: 'node_1' }, { name: 'node_2' }];
      links = [
        { source: 0, target: 1, value: 90 },
        { source: 0, target: 2, value: 0 },
      ];

      nodesMap = new Map();
      nodesMap.set(0,nodes[0]);
      nodesMap.set(1,nodes[1]);
      nodesMap.set(2,nodes[2]);
      filter._markUsedNodes(nodesMap, links); 

      result_node0_name = nodesMap.get(0).name;
      result_node1_name = nodesMap.get(1).name;
      result_node2_name = nodesMap.get(2).name;
      result_node0_valid = nodesMap.get(0).valid;
      result_node1_valid = nodesMap.get(1).valid;
      result_node2_valid = nodesMap.get(2).valid;

      assert.equal(result_node0_name, nodes[0].name);
      assert.equal(result_node1_name, nodes[1].name);
      assert.equal(result_node2_name, nodes[2].name);
      assert.equal(result_node0_valid, true);
      assert.equal(result_node1_valid, true);
      assert.equal(result_node2_valid, true);
    }); 

    it('should generate nodes map with unused node', function() {
      nodes = [{ name: 'node_0' }, { name: 'node_1' }, { name: 'node_2' }, { name: 'node_3' }];
      links = [
        { source: 0, target: 1, value: 90 },
        { source: 0, target: 2, value: 90 },
      ];

      nodesMap = new Map();
      nodesMap.set(0,nodes[0]);
      nodesMap.set(1,nodes[1]);
      nodesMap.set(2,nodes[2]);
      nodesMap.set(3,nodes[3]);
      filter._markUsedNodes(nodesMap, links); 

      result_node0_name = nodesMap.get(0).name;
      result_node1_name = nodesMap.get(1).name;
      result_node2_name = nodesMap.get(2).name;
      result_node3_name = nodesMap.get(3).name;
      result_node0_valid = nodesMap.get(0).valid;
      result_node1_valid = nodesMap.get(1).valid;
      result_node2_valid = nodesMap.get(2).valid;
      result_node3_valid = nodesMap.get(3).valid;

      assert.equal(result_node0_name, nodes[0].name);
      assert.equal(result_node1_name, nodes[1].name);
      assert.equal(result_node2_name, nodes[2].name);
      assert.equal(result_node3_name, nodes[3].name);
      assert.equal(result_node0_valid, true);
      assert.equal(result_node1_valid, true);
      assert.equal(result_node2_valid, true);
      assert.equal(result_node3_valid, undefined);
    }); 
  });

  describe('privateFkt_filterLinks()', function() {
    it('should filter links with null values', function() {
      nodes = [{ name: 'node_0' }, { name: 'node_1' }, { name: 'node_2' }];
      links = [
        { source: 0, target: 1, value: 90 },
        { source: 0, target: 2, value: 0 },
      ];
      result = filter._filterLinks(nodes, links);
      assert.equal(result.length, 1);
      assert.equal(result[0].value, 90);
    });

    it('should filter links no existing nodes', function() {
      nodes = [{ name: 'node_0' }, { name: 'node_1' }, { name: 'node_2' }];
      links = [
        { source: 0, target: 1, value: 90 },
        { source: 0, target: 2, value: 90 },
        { source: 1, target: 3, value: 90 }
      ];
      result = filter._filterLinks(nodes, links);
      result_link0_source = result[0].source;
      result_link1_source = result[1].source;
      result_link0_target = result[0].target;
      result_link1_target = result[1].target;
      result_link2 = result[2];

      assert.equal(result.length, 2);
      assert.equal(result_link0_source, 0);
      assert.equal(result_link0_target, 1);
      assert.equal(result_link1_source, 0);
      assert.equal(result_link1_target, 2);
      assert.equal(result_link2, undefined);
    });
  });

  describe('privateFkt_generateNodesMap()', function() {
    it('should generate nodes map with all nodes valid', function() {
      nodes = [{ name: 'node_0' }, { name: 'node_1' }, { name: 'node_2' }];
      links = [
        { source: 0, target: 1, value: 90 },
        { source: 0, target: 2, value: 90 },
      ];
      result = filter._generateNodesMap(nodes, links); 
      result_node0_name = result.get(0).name;
      result_node1_name = result.get(1).name;
      result_node2_name = result.get(2).name;
      result_node0_valid = result.get(0).valid;
      result_node1_valid = result.get(1).valid;
      result_node2_valid = result.get(2).valid;

      assert.equal(result_node0_name, nodes[0].name);
      assert.equal(result_node1_name, nodes[1].name);
      assert.equal(result_node2_name, nodes[2].name);
      assert.equal(result_node0_valid, true);
      assert.equal(result_node1_valid, true);
      assert.equal(result_node2_valid, true);
    }); 

    it('should generate nodes map with link including null value', function() {
      nodes = [{ name: 'node_0' }, { name: 'node_1' }, { name: 'node_2' }];
      links = [
        { source: 0, target: 1, value: 90 },
        { source: 0, target: 2, value: 0 }
      ];
      result = filter._generateNodesMap(nodes, links); 
      result_node0_name = result.get(0).name;
      result_node1_name = result.get(1).name;
      result_node2_name = result.get(2).name;
      result_node0_valid = result.get(0).valid;
      result_node1_valid = result.get(1).valid;
      result_node2_valid = result.get(2).valid;

      assert.equal(result_node0_name, nodes[0].name);
      assert.equal(result_node1_name, nodes[1].name);
      assert.equal(result_node2_name, nodes[2].name);
      assert.equal(result_node0_valid, true);
      assert.equal(result_node1_valid, true);
      assert.equal(result_node2_valid, true);
    }); 

    it('should generate nodes map with unused node', function() {
      nodes = [{ name: 'node_0' }, { name: 'node_1' }, { name: 'node_2' }, { name: 'node_3' }];
      links = [
        { source: 0, target: 1, value: 90 },
        { source: 0, target: 2, value: 90 }
      ];
      result = filter._generateNodesMap(nodes, links); 
      result_node0_name = result.get(0).name;
      result_node1_name = result.get(1).name;
      result_node2_name = result.get(2).name;
      result_node3_name = result.get(3).name;
      result_node0_valid = result.get(0).valid;
      result_node1_valid = result.get(1).valid;
      result_node2_valid = result.get(2).valid;
      result_node3_valid = result.get(3).valid;

      assert.equal(result_node0_name, nodes[0].name);
      assert.equal(result_node1_name, nodes[1].name);
      assert.equal(result_node2_name, nodes[2].name);
      assert.equal(result_node3_name, nodes[3].name);
      assert.equal(result_node0_valid, true);
      assert.equal(result_node1_valid, true);
      assert.equal(result_node2_valid, true);
      assert.equal(result_node3_valid, undefined);
    }); 
  });

  describe('privateFkt_generateRefNodesMap()', function() {
    it('should generate reference node map with one invalid node', function() {
      nodesMap = new Map();
      nodesMap.set(0, { name: 'node_0', valid: true });
      nodesMap.set(1, { name: 'node_1' });
      nodesMap.set(2, { name: 'node_2', valid: true });
      result = filter._generateRefNodesMap(nodesMap); 
      result_node0_newIndex = result.get(0); 
      result_node1_newIndex = result.get(1); 
      result_node2_newIndex = result.get(2); 
      assert.equal(result_node0_newIndex, 0);
      assert.equal(result_node1_newIndex, undefined);
      assert.equal(result_node2_newIndex, 1);
    }); 
  });

  describe('privateFkt_updateLinks()', function() {});

  describe('privateFkt_convertNodesMapToArray()', function() {});

});
