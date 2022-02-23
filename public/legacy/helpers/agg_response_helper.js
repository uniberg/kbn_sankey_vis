const { bucketReplaceProperty } = require('./bucket_replace_property_helper');

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

  function _generateNodeArray(nodesMap) {
    const nodeArray = [];
    nodesMap.forEach((nodeName, nodeId) => {
      nodeArray.push({ nodeId, name: nodeName });
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
  function _convertObjectToArray({rows, missingValues, groupBucket}) {
    // In the new kibana version, the rows are of type object , where they should be of type array to match the rest of the algorithm .
    // This is a function to convert the object ( 'col-0-2' : [array]... ) to (0 : [array])
    let newRows = [];
    // The structure of the bucket is as follow: { col-0-1: string, col-0-2: string... }
    rows.map(function(bucket) {
      // Object in javascript are mutable, this is why we should create a copy and then update it without modifying the original 'resp.rows'
      // otherwise the rest of the application will be broken
      // https://github.com/uniberg/kbn_sankey_vis/issues/14
      const bucketCopy = Object.assign({}, bucket);
      // Cell refers to col-0-1, col-0-2...
      for (let cell in bucketCopy) {
        // Update the bucket if 'Show missing values' is checked
        // by default, the value is '__missing__'
        // kibana/kibana-repo/src/ui/public/agg_types/buckets/terms.js
        if (bucketCopy[cell] === '__missing__' && missingValues.length > 0) {
          bucketReplaceProperty(missingValues, bucketCopy, cell);
        }
        // Update the bucket if 'Group other bucket' is checked
        if (bucketCopy[cell] === '__other__' && groupBucket.length > 0) {
          bucketReplaceProperty(groupBucket, bucketCopy, cell);
        }
        Object.defineProperty(
          bucketCopy,
          cell.split('-')[1],
          Object.getOwnPropertyDescriptor(bucketCopy, cell)
        );
        delete bucketCopy[cell];
      }
      newRows.push(_.values(bucketCopy));
    });

    return newRows;
  }
  function aggregate({rows, missingValues, groupBucket}) {
    const paths = _convertObjectToArray({rows, missingValues, groupBucket});
    const nodesMap = _generateNodesMap(paths);
    const linksMap = _generateLinksMap(paths, nodesMap);
    const nodes = _generateNodeArray(nodesMap);
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
    _generateNodeArray,
    _convertLinksMapToArray,

    aggregate
  };

}());
