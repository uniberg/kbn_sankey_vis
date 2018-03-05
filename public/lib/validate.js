/**
 * Transform structure of link-list.
 * @example: 
 * LIST: [{source: 0, target: 1, value: 100}] 
 * _transformLinksId2Name(LIST) -> [{
 *   source: {id: 0, name: 'a'},
 *   target: {id: 1, name: 'b'},
 *   value: 100
 * }]
 * @param {array<object>} nodes - list of nodes.
 * @param {array<object>} links - list of links.
 * @return {array<object>} - transformed list of links.
 */
const _transformLinksId2Name = function(nodes, links) {
  return links.map(link => {
    link.source = { id: link.source, name: nodes[link.source].name };
    link.target = { id: link.target, name: nodes[link.target].name };
    return link;
  });
}

/**
 * Transform structure of link-list.
 * (invert function of _transformLinksId2Name)
 * @example: 
 * LIST: [{
 *   source: {id: 0, name: 'a'},
 *   target: {id: 1, name: 'b'},
 *   value: 100
 * }]
 * _transformLinksId2Name(LIST) -> [{source: 0, target: 1, value: 100}]
 * @param {array<object>} nodes - list of nodes.
 * @param {array<object>} links - list of links.
 * @return {array<object>} - transformed list of links.
 */
const _transformLinksName2Id = function(nodes, links) {
  return links.map(link => {
    link.source = nodes.findIndex(node => node.name === link.source.name);
    link.target = nodes.findIndex(node => node.name === link.target.name);
    return link;
  })
}


/** 
 * Split invalid and valid links.
 * @param {array<object>} links - list of links.
 * @return {object} - object with two lists valid and invalid links.
 */
const _splitLinks = function(links) {
  const invalidLinks = links.filter(link => !link.value);
  const validLinks = links.filter(link => link.value);
  return {invalidLinks, validLinks};
}

/**
 * Fetch all nodes from link-list.
 * @param {array<object>} nodes - 
 * @param {array<object>} links - 
 * @return {array<object>} - nodes from link-list.
 */
const _getNodesFromLinks = function(nodes, links) {
  const nodeSet = new Set();
  links.map(link => {
    nodeSet.add(nodes[link.source.id]);
    nodeSet.add(nodes[link.target.id]);
  });
  return Array.from(nodeSet);
}

/**
 * Get list of unused nodes.
 * @param {array<object>} links - list of links.
 * @param {array<object>} nodes - list of nodes.
 * @return {array<object>} - invalid nodes.
 */
const _validateNodes = function(links, nodes) {
  return nodes.filter(node => {
    const result = links.filter(link => (node.name === link.source.name) || (node.name === link.target.name));
    return result.length <= 0;
  });
}

/**
 * Remove nodes
 * @param {array<object>} allNodes - list of all nodes.
 * @param {array<object>} removeNodes - list of removable nodes.
 * @return {array<object>} - all nodes without removable nodes.
 */
const _removeNodes = function(allNodes, removeNodes) {
  return allNodes.filter(originalNode => {
    const result = removeNodes.filter(removeNode => {
      return removeNode.name === originalNode.name;
    });
    return result.length <= 0;
  });
}

/**
 * Validate data and removed invalid elements.
 * data should contain list of nodes and links.
 * @param {object} data - object with nodes and links.
 * @return {object} - valid nodes and links.
 */
module.exports = function validate(data) {
  // transform links
  const transformedLinks = _transformLinksId2Name(data.nodes, data.links);

  // filter links 
  const {invalidLinks, validLinks} = _splitLinks(transformedLinks);
  
  // validate nodes from invalid links
  const validateNodes = _getNodesFromLinks(data.nodes, invalidLinks);
  const removableNodes = _validateNodes(validLinks, validateNodes);
  
  // remove nodes
  const nodes = _removeNodes(data.nodes, removableNodes);
  
  // transform links back
  const links = _transformLinksName2Id(nodes, validLinks);
  
  return {nodes, links};
};
