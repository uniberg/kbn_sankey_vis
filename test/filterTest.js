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
});
