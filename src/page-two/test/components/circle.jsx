import React from 'react';
// import ReactDOM from 'react-dom';
import d3    from 'd3';

export default class Circle extends React.Component {
  componentDidMount() {
    this.renderCircle();
  }

  componentDidUpdate() {
    this.renderCircle();
  }

  renderCircle() {
    var node  = this.refs.circle;
    // var circle = d3.svg.axis().orient(this.props.orient).ticks(5).scale(this.props.scale);
    // d3.select(node).transition().call(axis);

    //Create circles
    d3.select(node)
      .data([1])
      .transition()
      .attr("cx", this.props.cx)
      .attr("cy", this.props.cy)
      .attr("r", this.props.r);
  }

  render() {
    return <circle className="circle" ref="circle"></circle>
  }
}
//
// //Define X axis
// var xAxis2 = d3.axisBottom(xScale2)
//   .ticks(5);
// //Create X axis
// svg2.append("g")
//   .attr("class", "x-axis")
//   .attr("transform", "translate(0," + (h - padding) + ")")
//   .call(xAxis2);
// //Update X axis
// svg2.select(".x-axis")
//     .transition()
//     .duration(1000)
//   .call(xAxis2);
//
// //Create circles
// svg2.selectAll("circle")
//   .data(dataset)
//   .enter()
//   .append("circle")
//   .attr("cx", function(d) {
//     return xScale2(d[0]);
//   })
//   .attr("cy", function(d) {
//     return yScale2(d[1]);
//   })
//   .attr("r", 2);
//
//   //Update all circles
//   svg2.selectAll("circle")
//     .data(dataset)
//     .transition()
//     .duration(1000)
//     .on("start", function() {  // <-- Added in a start transition so that the color will change while they move
//       d3.select(this)
//         .attr("fill", "cyan")
//         .attr("r", 3);
//     })
//     .attr("cx", function(d) {
//       return xScale2(d[0]);
//     })
//     .attr("cy", function(d) {
//       return yScale2(d[1]);
//     })
//     .on("end", function() { // <-- Added in an end transition so that they'll change back
//       d3.select(this)
//         .transition()
//         .duration(1000)
//         .attr("fill", "black")
//         .attr("r", 2);
//     });
