// unfinished/src/components/chart.jsx
import React from 'react';
import ScatterPlot from './scatter-plot';
// Adding in redux
import { connect } from 'react-redux';
// import store from '../../../store';   // Magic. FOR DISPATCH: You can just use this.props. instead of store. because of the <Provider> in src/index.js
import { GET_DATA_SCATTER } from '../../../actions/actions';

import d3    from 'd3';


//Width and height
var w = 400;
var h = 300;

//Original data
var dataset = [
  [
    { x: 0, y: 5 },
    { x: 1, y: 4 },
    { x: 2, y: 2 },
    { x: 3, y: 7 },
    { x: 4, y: 23 }
  ],
  [
    { x: 0, y: 10 },
    { x: 1, y: 12 },
    { x: 2, y: 19 },
    { x: 3, y: 23 },
    { x: 4, y: 17 }
  ],
  [
    { x: 0, y: 22 },
    { x: 1, y: 28 },
    { x: 2, y: 32 },
    { x: 3, y: 35 },
    { x: 4, y: 43 }
  ]
];

//Set up stack method
var stack = d3.layout.stack();

//Data, stacked
stack(dataset);

//Set up scales
var xScale = d3.scale.ordinal()
  .domain(d3.range(dataset[0].length))
  .rangeRoundBands([0, w], 0.05);

var yScale = d3.scale.linear()
  .domain([0,
    d3.max(dataset, function(d) {
      return d3.max(d, function(d) {
        return d.y0 + d.y;
      });
    })
  ])
  .range([0, h]);

//Easy colors accessible via a 10-step ordinal scale
var colors = d3.scale.category10();

//Create SVG element
var svg = d3.select("body")
      .append("svg")
      .attr("width", w)
      .attr("height", h);

// Add a group for each row of data
var groups = svg.selectAll("g")
  .data(dataset)
  .enter()
  .append("g")
  .style("fill", function(d, i) {
    return colors(i);
  });

// Add a rect for each data value
var rects = groups.selectAll("rect")
  .data(function(d) { return d; })
  .enter()
  .append("rect")
  .attr("x", function(d, i) {
    return xScale(i);
  })
  .attr("y", function(d) {
    return yScale(d.y0);
  })
  .attr("height", function(d) {
    return yScale(d.y);
  })
  .attr("width", xScale.rangeBand());


class Chart extends React.Component{
  // constructor(props) {
  //   super(props);
  //   this.state = { data: randomDataSet() };
  // }



  render() {

    return <div className='stacked-bar'>
      <h1> ... </h1>


    </div>
  }
};

const mapStateToProps = function(store) {
  return {
    data: store.scatterState.data
  };
}

export default connect(mapStateToProps)(Chart);
