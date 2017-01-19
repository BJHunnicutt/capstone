// unfinished/src/components/x-y-axis.jsx
import React  from 'react';
import Bar   from './bar';
import _ from 'lodash'


const renderBars = (props) => {
  return (coords, index) => { //coords are being passed as props below in .map(renderCircles(props))
    const barProps = {
      x: props.xScale(coords[0]),
      y: props.yScale(coords[1]),
      h: 2,
      w: 3,
      key: index
    };
    return <Bar {...circleProps} />;
  };
};

export default (props) => {

  // // Add a group for each row of data
  // var groups = svg.selectAll("g")
  //   .data(dataset)
  //   .enter()
  //   .append("g")
  //   .style("fill", function(d, i) {
  //     return colors(i);
  //   });
  //
  // // Add a rect for each data value
  // var rects = groups.selectAll("rect")
  //   .data(function(d) { return d; })
  //   .enter()
  //   .append("rect")
  //   .attr("x", function(d, i) {
  //     return xScale(i);
  //   })
  //   .attr("y", function(d) {
  //     return yScale(d.y0);
  //   })
  //   .attr("height", function(d) {
  //     return yScale(d.y);
  //   })
  //   .attr("width", xScale.rangeBand());
  //



  // let data = _.range(50).map(function (x, i) { return [x,i] });
  return null
  // <g>{ props.data.map(renderBars(props)) }</g>
}
