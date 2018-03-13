/**
 * This function filters the input data and removes all invalid values.
 * It removes all links with an empty or 0 value, all nodes without an link and all links with not existing nodes.
 *
 * The input parameter links contains two fields source and target which reference the 
 * corrisponding nodes in the nodes array.
 * The removal of one node, makes an update of all related links necessary.
 * To avoid this, we filter all invalid links and remove all unused nodes from nodes array.
 * We also used a reference node map to update the source and target nodes in the links. 
 * After the filtering the map is converted back into the initial array structure.
 * 
 * #Definitions:
 * ##Input Parameter
 *
 * nodes: {array<NODE>}
 *    This is an input parameter and contains an array of NODEs.
 *
 * links: {array<LINK>}
 *    This is an input parameter, it contains an array of LINKs.
 *
 * NODE: { name: <string> }
 *    A node is an object with only one attribute `name`.
 *
 * LINK: { source: NODE_INDEX, target: NODE_INDEX, value: <number> }
 *    A link is an object with three attributes. It binds two nodes and give them a value.
 *    The source and target attributes are indices and references to the nodes array.
 *
 * NODE_INDEX: {number}
 *    A node index is the index of a node in the nodes array.
 * 
 * ##Inner Data Structures
 *
 * NODE_MAP: {map: NODE_INDEX => NEW_NODE}
 *    Mapping of the node index to the node object with additional attributes.
 *
 * REF_NODE_MAP: {map: NODE_INDEX => NODE_INDEX}
 *    Mapping of the old node index to the new node index.
 *    After removing nodes in the nodes array, all node indices will be changed. 
 *    To update the node references in the links, we create a map which reference the old node index
 *    to the new node index.
 * 
 * NEW_NODE: { name: <string>, valid: <boolean> }
 *    Copy of NODE with an additional attribute `valid`. 
 *    The valid attribute is a flag to show which nodes is include inner the links array.
 */
module.exports = (function () {
  /**
   * Check if node exists in nodes array.
   *
   * @private
   * @param {array<NODE>} nodes - The nodes array.
   * @param {number} index - The node index.
   * @returns {boolean} - true, if node exist else false.
   */
  function _isNodeExist(nodes, index) { return !!nodes[index]; }

  /**
   * Get node if exist
   * else returns an empty object.
   *
   * @private
   * @param {NODE_MAP} nodesMap - The nodes map.
   * @param {number} index - The node index.
   * @returns {NODE} - The node object.
   */
  function _getNode(nodesMap, index) { return nodesMap.get(index) || {}; }

  /**
   * Add valid attribute to each node, which relates to a link. 
   *
   * @private
   * @param {NODE_MAP} nodesmap - The nodes map.
   * @param {array<LINK>} links - The links array.
   * @returns void
   */
  function _markUsedNodes(nodesMap, links) {
    links.map(({source, target}) => {
      const srcNode = _getNode(nodesMap, source);
      if (srcNode !== undefined) { srcNode.valid = true; }

      const tarNode = _getNode(nodesMap, target);
      if (tarNode !== undefined) { tarNode.valid = true; }
    });
  }

  /**
   * Filter the links array.
   * Validates on existing nodes and values greater null.
   *
   * @private
   * @param {array<NODE>} nodes - The nodes array.
   * @param {array<LINK>} links - The links array.
   * @returns {array<LINK>} - The filtered links array.
   */
  function _filterLinks(nodes, links) {
    return links.filter(({source, target, value}) => {
      const isSrcNodeValid = _isNodeExist(nodes, source);
      const isTarNodeValid = _isNodeExist(nodes, target);
      return (!!value) && (isSrcNodeValid) && (isTarNodeValid);
    })
  }

  /**
   * Generate nodes map.
   *
   * @private
   * @param {array<NODE>} nodes - The nodes array.
   * @param {array<LINK>} links - The links array.
   * @returns {NODE_MAP} - The nodes map.
   */
  function _generateNodesMap(nodes, links) {
    const nodesMap = new Map();
    nodes.map(({name}, index) => nodesMap.set(index, {name}));
    _markUsedNodes(nodesMap, links);
    return nodesMap;
  }

  /**
   * Generate reference nodes map.
   *
   * @private
   * @param {NODE_MAP} - The nodes map.
   * @returns {REF_NODE_MAP} - The reference nodes map.
   */
  function _generateRefNodesMap(nodesMap) {
    const refNodeMap = new Map();
    let i = 0;
    nodesMap.forEach(({name, valid}, key) => {
      if (valid) {
        refNodeMap.set(key, i++);
      }
    });
    return refNodeMap;
  }

  /**
   * Update source and target attribute of each link.
   *
   * @private
   * @param {array<LINK>} links - The links array.
   * @param {REF_NODE_MAP} refNodesMap - The mapping from old to new node indices.
   * @returns {array<LINK>} - The updated links array.
   */
  function _updateLinks(links, refNodesMap) {
    return links.map(({source, target, value}) => {
      return {
        source: refNodesMap.get(source),
        target: refNodesMap.get(target),
        value
      }
    });
  }

  /**
   * Converts nodes map to nodes array.
   * Removed all nodes without or invalid `valid`-attribute.
   *
   * @private
   * @param {NODE_MAP} nodesMap - The nodes map.
   * @param {REF_NODE_MAP} refNodesMap - The mapping from old to new node indices.
   * @returns {array<NODE>} - The filtered nodes array.
   */
  function _convertNodesMapToArray(nodesMap, refNodesMap) {
    const nodes = [];
    nodesMap.forEach(({name, valid}, key) => {
      if (valid) { 
        const newIndex = refNodesMap.get(key);
        nodes[newIndex] = { name };
      }
    });
    return nodes
  }

  /**
   * Filter invalid nodes and links out.
   *
   * @param {array<NODE>} nodes - The nodes array.
   * @param {array<LINK>} links - The links array.
   * @returns {object} - Valid nodes and links.
   */
  function filterNodesAndLinks(nodes, links) {
    const filteredLinks = _filterLinks(nodes, links);
    const nodesMap = _generateNodesMap(nodes, filteredLinks);
    const refNodesMap = _generateRefNodesMap(nodesMap);
    const updatedLinks = _updateLinks(filteredLinks, refNodesMap);
    const filteredNodes = _convertNodesMapToArray(nodesMap, refNodesMap);
    return { 
      nodes: filteredNodes,
      links: updatedLinks
    }
  }

  return { 
    _isNodeExist,
    _getNode,
    _markUsedNodes,
    _filterLinks,
    _generateNodesMap,
    _generateRefNodesMap,
    _updateLinks,
    _convertNodesMapToArray,

    filterNodesAndLinks
  };
}());
