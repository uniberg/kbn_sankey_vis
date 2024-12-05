# Kibana Sankey Diagram Plugin

This is a sankey diagram visType plugin for Kibana.

The plugin is compatible with Kibana 8.16.0 and some other older versions( please refer to the release section)

This plugin was developed from <https://github.com/elastic/kibana/pull/4832>.

Here is an example:

![Sankey](sankey_8.png)

The plugin has some new features:
- A filter according to the node will be applied once you click on a specific node:
![filter](sankey-filtering.png)

- A filter according to the path will be applied once you click on a specific path:
![filter](sankey-multifilter.png)

- Enabling the drag and drop on the nodes can now be activated/deactivated.
<b>Please note that enabling this feature will result on disabling the previous filtering.</b>
![filter](sankey-drag.png)

# Install

```
git clone https://github.com/uniberg/kbn_sankey_vis.git sankey_vis
cd sankey_vis
yarn install
yarn compile
yarn start
```
# Use
In development mode:
* Navigate to Kibana (http://localhost:5601).
* Go to "Visualize Library" app.
* Click "Create visualization".
* Click "Aggregation Based".
* Choose "Sankey Diagram"
# Uninstall

```
bin/kibana-plugin remove kbn-sankey-vis
```

# Building a Release
Building a release only means packaging the plugin with all its dependencies into a zip archive. Important is to put the plugin in a folder called kibana before zipping it.
The following steps would produce a release of the current head master branch.
```
mkdir kibana
git clone https://github.com/uniberg/kbn_sankey_vis.git sankey_vis
cd sankey_vis
[optional] git checkout -branch
yarn install
yarn compile-and-build
```
