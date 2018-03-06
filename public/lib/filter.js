/**
 * This function filters the input data and removes all invalid values.
 * It removes all links with an empty or 0 value and all nodes without an link.
 *
 * The input parameter links contains two fields source and target which reference the 
 * corrisponding nodes in the nodes array.
 * The removal of one node, makes an update of all related links necessary.
 * To avoid this, we convert the input parameters into an map and filter all invalid values.
 * After the filtering the map is converted back into the initial array structure.
 * 
 * #Assumptions
 * The node name must be unique, because it will be used as an identifier. 
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
 * LINK: { source: <number>, target: <number>, value: <number> }
 *    A link is an object with three attributes. It binds two nodes and give them a value.
 *    The source and target attributes are indices and references to the nodes array.
 *
 * ##Inner Data Structures
 *
 * linkmap: {map<key, NEW_LINK>}
 *    A linkmap is a map. It is the converted form of the links array.
 *
 * NEW_LINK: { source: <string>, target: <string>, value: <number> }
 *    Same as the LINK object with one difference.
 *    The source and target attributes are the names of the NODE objects.
 */
module.exports = (function () {

  /**
   * Get node name of the given index.
   *
   * @param {array<NODE>} nodes - Array of node objects.
   * @param {number} name - The node index.
   * @returns {string} - The node name.
   */
  const _getNodeName = (nodes, index) => nodes[index].name;

  /**
   * Get node index of the given name.
   *
   * @param {array<NODE>} nodes - Array of node objects.
   * @param {string} name - The node name.
   * @returns {number} - The node index. Returns `-1` if node name not found.
   */
  const _getNodeIndex = (nodes, name) => nodes.findIndex(node => node.name === name);

  /**
   * Add node if not exist to nodes array.
   *
   * @param {array<NODE>} nodes - Array of node objects.
   * @param {string} name - The node name.
   * @returns {number} - The index of added node 
   *    or if the name already exists the index of the existing node.
   */
  const _addNode = (nodes, name) => {
    let index = _getNodeIndex(nodes, name);
    if (index < 0) { index = nodes.push({ name }); }
    return index;
  };

  /**
   * Add link to links array.
   *
   * @param {array<NODE>} nodes - Array of node objects.
   * @param {array<LINK>} links - Array of link objects.
   * @param {LINK} link - The link object.
   * @returns {number} - The index of given link.
   */
  const _addLink = (nodes, links, link) => {
    return links.push({
      source: _getNodeIndex(nodes, link.source),
      target: _getNodeIndex(nodes, link.target),
      value: link.value
    });
  };

  /**
   * Converts a linkmap to an object with two attributes,
   * Array of nodes and array of links.
   *
   * @param {map} linkmap - The linkmap.
   * @returns {object} - With all nodes and links.
   */
  const _convertMapToObject = (linkmap) => {
    const nodes = [];
    const links = [];
    linkmap.forEach((link) => {
      _addNode(nodes, link.source);
      _addNode(nodes, link.target);
      _addLink(nodes, links, link);
    });
    return { nodes, links };
  };

  /**
   * Filters invalid values from linkmap.
   * An invalid value could be a `0` value.
   *
   * @param {map} linkmap - The linkmap.
   * @returns {map} - Linkmap without invalid values.
   */
  const _filterLinkMap = (linkmap) => {
    linkmap.forEach((link, key) => {
      if (!link.value) {
        linkmap.delete(key);
      }
    });
    return linkmap;
  };

  /**
   * Generate a linkmap.
   * Generates a key for each link.
   *
   * @param {array<NODE>} nodes - Array of node objects.
   * @param {array<LINK>} links - Array of link objects.
   * @returns {map} - The linkmap.
   */
  const _generateLinkMap = (nodes, links) => {
    const linkmap = new Map();
    links.map((link, index) => {
      linkmap.set(index, {
        source: _getNodeName(nodes, link.source),
        target: _getNodeName(nodes, link.target),
        value: link.value
      });
    });
    return linkmap;
  };

  /**
   * Filter invalid nodes and links out.
   *
   * @param {array<NODE>} nodes - Array of node objects.
   * @param {array<LINK>} links - Array of link objects.
   * @returns {object} - Valid nodes and links.
   */
  const filterNodesAndLinks = (nodes, links) => {
    // generate hashmap
    const linkmap = _generateLinkMap(nodes, links);
    // delete invalid links and nodes
    const filteredLinkmap = _filterLinkMap(linkmap);
    // convert linkmap to links and nodes
    return _convertMapToObject(filteredLinkmap);
  };

  return { filterNodesAndLinks };
}());
