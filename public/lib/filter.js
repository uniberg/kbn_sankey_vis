/**
 * This function filters the input data and removes all invalid values.
 * It removes all links with an empty or 0 value and all nodes without an link.
 *
 * The input parameter links contains two fields source and target which reference the 
 * corrisponding nodes in the nodes array.
 * The removal of one node, makes an update of all related links necessary.
 * To avoid this, we add some additionally attributes to the nodes array and then
 * filter the nodes and links array. 
 * After the filtering the map is converted back into the initial array structure.
 * 
 * #Definitions:
 * ##Input Parameter
 *
 * nodes: {array<NODE || NEW_NODE>}
 *    This is an input parameter and contains an array of NODEs or NEW_NODEs.
 *
 * links: {array<LINK>}
 *    This is an input parameter, it contains an array of LINKs.
 *
 * NODE: { name: <string> }
 *    A node is an object with only one attribute `name`.
 *
 * LINK: { source: <number>, target: <number>, value: <number> }
 *    A link is an object with three attributes. It binds two nodes and give them a value.
 *    The source and target attributes are indices and references to the nodes array.
 *
 * ##Inner Data Structures
 *
 * NEW_NODE: { name: <string>, index: <number>, valid: <boolean> }
 *    Copy of NODE with two additional attributes index and valid. 
 *    The index attribute is the old node index, which relates to a LINK.
 *    The valid attribute is a flag to show which nodes could be deleted.
 */
module.exports = (function () {

  /**
   * Is node valid.
   * Check if node relates to any link.
   *
   * @param {number} index - The nodex index.
   * @param {links} links - The links array.
   * @returns {boolean} - true if node valid, else false.
   */
  function _isNodeValid(index, links) {
    return links.some(link => (link.source === index) || (link.target === index));
  }

  /**
   * Get array index of old index.
   *
   * @param {array<NEW_NODE>} nodes - The nodes array with additional attributes.
   * @param {number} oldIndex - The index of the old nodes array.
   * @returns {number} - The new nodes array index.
   */
  function _findNodeIndex(nodes, oldIndex) {
    return nodes.findIndex(({index}) => index === oldIndex);
  }

  /**
   * Filter invalid values from links array.
   * An invalid value could be a `0` value. 
   *
   * @param {array<LINK>} links - The links array.
   * @returns {array<Link>} - The filtered links array.
   */
  function _filterLinks(links) { return links.filter(({value}) => value); }

  /**
   * Filter invalid nodes from nodes array.
   * Invalid nodes are nodes which are not relates to any link.  
   *
   * @param {array<NODE>} nodes - The nodes array.
   * @param {array<LINK>} links - The links array.
   * @returns {array<NODE>} - The filtered nodes array.
   */
  function _filterNodes(nodes, links) {
    return nodes
    .map(({name}, index) => {
      const valid = _isNodeValid(index, links);
      return {index, name, valid};
    })
    .filter(node => node.valid);
  }

  /**
   * Update source and target node index from links array.
   *
   * @param {array<NEW_NODE>} nodes - The nodes array with additional attributes.
   * @param {array<LINK>} links - The links array.
   * @return {array<LINK>} - The links array with updated node indices.
   */
  function _updateLinks(nodes, links) {
    return links.map(link => {
      const source = _findNodeIndex(nodes, link.source);
      const target = _findNodeIndex(nodes, link.target);
      return { source, target, value: link.value };
    });
  }

  /**
   * Convert nodes array to old structure.
   * Removed additional attributes from every node.
   *
   * @param {array<NEW_NODE>} nodes - The nodes array with additional attributes.
   * @returns {array<NODE>} - The nodes array.
   */
  function _convertNodes(nodes) {
    return nodes.map(({name}) => {
      return { name };
    });
  }

  /**
   * Update links array and convert nodes array to the old structure.
   *
   * @param {array<NEW_NODE>} nodes - The nodes array with additional attributes.
   * @param {array<LINK>} links - The links array.
   * @returns {object} - Valid nodes and links.
   */
  function _updateNodesAndLinks(nodes, links) {
    return { 
      links: _updateLinks(nodes, links), 
      nodes: _convertNodes(nodes)
    };
  }

  /**
   * Filter invalid nodes and links out.
   *
   * @param {array<NODE>} nodes - The nodes array.
   * @param {array<LINK>} links - The links array.
   * @returns {object} - Valid nodes and links.
   */
  function filterNodesAndLinks(nodes, links) {
    const filteredLinks = _filterLinks(links);
    const filteredNodes = _filterNodes(nodes, filteredLinks);
    return _updateNodesAndLinks(filteredNodes, filteredLinks);
  }

  return { filterNodesAndLinks };
}());
