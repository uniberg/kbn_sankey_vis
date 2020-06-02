// Kibana Dependencies
import { uiModules } from 'ui/modules';

// Own Dependencies
import d3 from 'd3';
import 'd3-plugins-sankey';
import AggResponseProvider from './lib/agg_response';
import { filterNodesAndLinks } from './lib/filter';
import { isBackgroundDark, appropriateTextColor } from './lib/color_theme';

const module = uiModules.get('kibana/kbn_sankey_vis', ['kibana']);
let observeResize = require('./lib/observe_resize');

module.controller('KbnSankeyVisController', function ($scope, $element, $rootScope, Private) {
  const sankeyAggResponse = Private(AggResponseProvider);
  $scope.emptyGraph = false;

  let svgRoot = $element[0];
  let resize = false;
  let color = d3.scale.category20();
  let margin = 20;
  let width;
  let height;
  let div;
  let svg;
  let globalData = null;

  let _updateDimensions = function _updateDimensions() {
    let delta = 10;
    let w = $element.parent().width() - 10;
    let h = $element.parent().height() - 40;
    if (w) {
      if (w > delta) {
        w -= delta;
      }
      width = w;
    }
    if (h) {
      if (h > delta) {
        h -= delta;
      }
      height = h;
    }
  };

  let _buildVis = function (data) {
    if(!resize){
      data.slices=filterNodesAndLinks(data.slices.nodes, data.slices.links);
    }
    $scope.emptyGraph = (data.slices.nodes.length <= 0) ;

    let energy = data.slices;
    div = d3.select(svgRoot);
    if (!energy.nodes.length) return;

    svg = div.append('svg')
      .attr('width', width)
      .attr('height', height + margin)
      .append('g')
      .attr('transform', 'translate(0, 0)');

    let sankey = d3.sankey()
      .nodeWidth(15)
      .nodePadding(10)
      .size([width, height]);

    let path = sankey.link();

    let defs = svg.append('defs');

    sankey
      .nodes(energy.nodes)
      .links(energy.links)
      .layout(13);

    let link = svg.append('g').selectAll('.link')
      .data(energy.links)
      .enter().append('path')
      .attr('class', 'link')
      .attr('d', path)
      .style('stroke-width', function (d) {
        return Math.max(1, d.dy);
      })
      .style('fill', 'none')
      .style('stroke-opacity', 0.18)
      .sort(function (a, b) {
        return b.dy - a.dy;
      })
      .on('mouseover', function() {
        d3.select(this).style('stroke-opacity', 0.5);
      })
      .on('mouseout', function() {
        d3.select(this).style('stroke-opacity', 0.2);
      });

    link.append('title')
      .text(function (d) {
        return d.source.name + ' → ' + d.target.name + '\n' + d.value;
      });

    let node = svg.append('g').selectAll('.node')
      .data(energy.nodes)
      .enter().append('g')
      .attr('class', 'node')
      .attr('transform', function (d) {
        return 'translate(' + d.x + ',' + d.y + ')';
      })
      .call(d3.behavior.drag()
        .origin(function (d) {
          return d;
        })
        .on('dragstart', function () {
          this.parentNode.appendChild(this);
        })
        .on('drag', dragmove));

    node.append('rect')
      .attr('height', function (d) {
        return d.dy;
      })
      .attr('width', sankey.nodeWidth())
      .style('fill', function (d) {
        d.color = color(d.name);
        return d.color;
      })
      .style('stroke', function (d) {
        return (isBackgroundDark(null, null)) ? d3.rgb(d.color).brighter(2) : d3.rgb(d.color).darker(2);
      })
      .append('title')
      .text(function (d) {
        return d.name + '\n' + d.value;
      });

    node.append('text')
      .attr('x', -6)
      .attr('y', function (d) {
        return d.dy / 2;
      })
      .attr('dy', '.35em')
      .style('fill', appropriateTextColor(null, null))
      .attr('text-anchor', 'end')
      .attr('transform', null)
      .text(function (d) {
        return d.name;
      })
      .filter(function (d) {
        return d.x < width / 2;
      })
      .attr('x', 6 + sankey.nodeWidth())
      .attr('text-anchor', 'start');

    // add gradient to links
    link.style('stroke', (d, i) => {

      // make unique gradient ids
      const gradientID = `gradient${i}`;

      const startColor = d.source.color;
      const stopColor = d.target.color;

      const linearGradient = defs.append('linearGradient')
          .attr('id', gradientID);

      linearGradient.selectAll('stop')
        .data([
            {offset: '10%', color: startColor },
            {offset: '90%', color: stopColor }
          ])
        .enter().append('stop')
        .attr('offset', d => {
          return d.offset;
        })
        .attr('stop-color', d => {
          return d.color;
        });

      return `url(#${gradientID})`;
    });

    resize=false;

    function dragmove(d) {
      d3.select(this).attr('transform', 'translate(' + d.x + ',' + (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) + ')');
      sankey.relayout();
      link.attr('d', path);
    }
  };
  let _render = window.render = function (data) {
    d3.select(svgRoot).selectAll('svg').remove();
    _buildVis(data);
  };
  let data;
  $scope.$watch('esResponse', function (resp) {
    if (resp) {
      data = sankeyAggResponse($scope.vis, resp);
      globalData = data;
      if (data && data.slices){
        _updateDimensions();
        _render(data);
      }
    }
  });
  observeResize($element, function () {
    if (data) {
      _updateDimensions();
      resize=true;
      _render(data);
    }
  });
});
