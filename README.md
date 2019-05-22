# Kibana Sankey Diagram Plugin

This is a sankey diagram visType plugin for Kibana 6.7+.

This plugin was developped from <https://github.com/elastic/kibana/pull/4832>.

Here is an example:

![Sankey](sankey_5_5_Screenshot1.PNG)

# Install

```
git clone https://github.com/uniberg/kbn_sankey_vis.git sankey_vis
cd sankey_vis
npm install
```

# Uninstall

```
bin/kibana plugin  --remove kbn_sankey_vis
```

# Building a Release
Building a release only means packaging the plugin with all its dependencies into a zip archive. Important is to put the plugin in a folder called kibana before zipping it.
The following steps would produce a release of the current head master branch.
```
mkdir kibana
git clone https://github.com/uniberg/kbn_sankey_vis.git sankey_vis
[optional] git checkout -branch
cd sankey_vis
npm install --production
cd ../..
zip -r sankey_vis-<version>.zip kibana --exclude ./kibana/sankey_vis/.git\*
```
