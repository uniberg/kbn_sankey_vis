/**
 * TODO: Description
 */

const stringify = require('json-stable-stringify');

module.exports = (function() {
  function _generateNodesMap(paths) {
    const nodesMap = new Map();
    paths.map(path => {
      path
      .slice(0, -1)
      .map((nodeName, index) => {
        const nodeKeyStr = _getNodeId(index, nodeName);
        nodesMap.set(nodeKeyStr, nodeName);
      });
    });
    return nodesMap; 
  }

  // TODO: Json in Json -> ugly code
  function _getLinkId( sourceNodeId, targetNodeId) {
    const linkKey = { sourceNodeId, targetNodeId };
    return stringify(linkKey);
  }

  function _getNodeId(layerIndex, nodeName) {
    const nodeKey = { layerIndex, nodeName };
    return stringify(nodeKey);
  }

  function _generateLinksMap(paths, nodesMap) {
    const linksMap = new Map();
    paths.map(path => {
      for(let layer = 0; layer < path.length - 2; layer++) {
        const sourceNodeName = path[layer];
        const targetNodeName = path[layer + 1];
        const value = path[path.length - 1];

        const sourceNodeId = _getNodeId(layer, sourceNodeName);
        const targetNodeId = _getNodeId(layer + 1, targetNodeName);

        const linkKeyStr = stringify({ sourceNodeId, targetNodeId });
        
        const oldValue = linksMap.get(linkKeyStr);
        if (oldValue) {
          // Sum up values
          const newValue = oldValue + value;
          linksMap.set(linkKeyStr, newValue);
        } else {
          // Add link
          linksMap.set(linkKeyStr, value);
        }
      }
    });
    return linksMap;
  }

  function _generateNodeIdMap(nodes) {
    const nodeIdMap = new Map();
    nodes.forEach(({nodeId}, nodeArrayIndex) => {
      nodeIdMap.set(nodeId, nodeArrayIndex);
    });
    return nodeIdMap;
  }

  function _generateSortedNodeArray(nodesMap) {
    const nodeArray = [];
    // create sort array
    nodesMap.forEach((nodeName, nodeId) => {
      nodeArray.push({ nodeId, name: nodeName });
    });
    nodeArray.sort((node1,node2) => {
      const node1Name = node1.name.toString();
      const node2Name = node2.name.toString();
      return node1Name.localeCompare(node2Name);
    });  
    return nodeArray;
  }

  function _convertLinksMapToArray(linksMap, nodeIdMap) {
    const links = [];
    linksMap.forEach((value, linkId) => {
      const {sourceNodeId, targetNodeId} = JSON.parse(linkId);
      links.push({
        source: nodeIdMap.get(sourceNodeId),
        target: nodeIdMap.get(targetNodeId),
        value
      });
    });
    return links;
  }

  function aggregate(paths) {
    const nodesMap = _generateNodesMap(paths);
    const linksMap = _generateLinksMap(paths, nodesMap);
    const nodes = _generateSortedNodeArray(nodesMap);
    const nodeIdMap = _generateNodeIdMap(nodes);
    const convertedLinks = _convertLinksMapToArray(linksMap, nodeIdMap);
    const cleanedD3Nodes = nodes.map(({name}) => { return { name }; });

    return { 
      nodes: cleanedD3Nodes,
      links: convertedLinks
    };
  }

  return {
    _generateNodesMap,
    _getLinkId,
    _getNodeId,
    _generateLinksMap,
    _generateNodeIdMap,
    _generateSortedNodeArray,
    _convertLinksMapToArray,
    
    aggregate
  };

}());
