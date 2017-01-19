// unfinished/src/components/scatter-plot.jsx
import React        from 'react';
import d3           from 'd3';
// import Bars  from './data-bars';
// import XYAxis       from './x-y-axis';




export default (props) => {

  // var stack = d3.layout.stack();
  // //Data, stacked
  // var dataset = stack(props.data);
  var dataset = props.data;

  //Set up scales
  var xScale = d3.scale.ordinal(props)
    .domain(d3.range(dataset[0].length))
    .rangeRoundBands([0, props.w], 0.05);

  var yScale = d3.scale.linear(props)
    .domain([0,
      d3.max(dataset, function(d) {
        return d3.max(d, function(d) {
          return d.y0 + d.y;
        });
      })
    ])
    .range([0, props.h]);

  //Easy colors accessible via a 10-step ordinal scale
  var zScale = d3.scale.category10();

  // //Create SVG element
  // var svg = d3.select("body")
  //       .append("svg")
  //       .attr("width", props.w)
  //       .attr("height", props.h);
  //
  const scales = { xScale: xScale(props), yScale: yScale(props), zScale: zScale };
  return <svg width={props.width} height={props.height}>
  {/* //   <Bars {...props} {...scales} /> */}
  {/* //   <XYAxis {...props} {...scales} /> */}
  </svg>
}
