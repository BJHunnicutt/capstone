import React from 'react';
// import ReactDOM from 'react-dom';
import d3 from 'd3';
// import allData from '../data/short_filtered.csv'
import store from '../../store';
import Autocomplete from 'react-autocomplete'
import { sortStates, matchStateToTerm, styles } from '../data/utils.js'
// import Chart from '../containers/scatter/chart.jsx';
// import veryImportantGif2 from '../../../public/dory2.gif'



let explore = false;
export default class RelationshipsDiagram extends React.Component {
  constructor(props){
    super(); // "To get our context"
    this.state = {
      // graph: mis,
      toggle: 0,   //Toggle stores whether the highlighting is on
      svg: '',
      // data: props.data
    }
    // console.log("constructor props: ", props);
  }
  // this.setState({
  //   globalSearch: cleanQuery,
  // });


  renderButton() {
    this.renderForceDiagram();
    explore = true;
  }

  updateData() {
    // console.log('click');
  }

  //This function looks up whether a pair are neighbours
  neighboring(a, b) {
    let graph = store.getState().scatterState.graphData;
    //---Insert-------


    //Create an array logging what is connected to what
    var linkedByIndex = {};
    for (let i = 0; i < graph.nodes.length; i++) {
        linkedByIndex[i + "," + i] = 1;
    };
    graph.links.forEach(function (d) {
        linkedByIndex[d.source.index + "," + d.target.index] = 1;
    });

    //---End Insert---
    return linkedByIndex[a.index + "," + b.index];
  }

  connectedNodes(node, link) {
    if (this.state.toggle === 0) {
      //Reduce the opacity of all but the neighbouring nodes
      let d = d3.select(this).node().__data__;
      node.style("opacity", function (o) {
          return this.neighboring(d, o) | this.neighboring(o, d) ? 1 : 0.1;
      });

      link.style("opacity", function (o) {
          return d.index === o.source.index | d.index === o.target.index ? 1 : 0.1;
      });

      //Reduce the op

      this.setState({
        toggle: 1,
      });
    } else {
      //Put them back to opacity=1
      node.style("opacity", 1);
      link.style("opacity", 1);
      this.setState({
        toggle: 0,
      });
    }
  }

  renderForceDiagram() {
    //Constants for the SVG
    // var width = 500, height = 500;
    let width = window.innerWidth * .96; // Testing out making the plot viewport responsive
    let height = 0.8 * window.innerHeight;

    //Set up the colour scale
    var color = d3.scale.category20();

    //Set up the force layout
    var force = d3.layout.force()
        .charge(-120)
        .linkDistance(30)
        .size([width, height]);

    // Define the div for the tooltip
    var div = d3.select(this.refs.forceDiagram).append("div")
        .attr("class", "rel-tooltip")
        .style("visibility", "hidden");

    //Append a SVG to the body of the html page. Assign this SVG as an object to svg
    var svg = d3.select(this.refs.forceDiagram)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    this.setState({
      svg: svg,
    });


    // let graph = this.state.graph;
    let graph = store.getState().scatterState.graphData;

    // d3.csv(allData, (data) => {
		// 	// console.log('d3csv: ', data);
		// 	return this.props.setUpRelationships(data);
    //
		// });

    //Creates the graph data structure out of the json data
    force.nodes(graph.nodes)
        .links(graph.links)
        .start();

    //Create all the line svgs but without locations yet
    let link = svg.selectAll(".link")
        .data(graph.links)
        .enter().append("line")
        .attr("class", "link")
        .style("stroke-width", function (d) {
        return Math.sqrt(d.value);
    });

    //Do the same with the circles for the nodes - no
    let node = svg.selectAll(".node")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", 8)
        .style("fill", function (d) {
          return color(d.group);
        })
        .call(force.drag)
        .on("mouseover", function(d) {
            div.transition()
                .duration(200)
                .style("visibility", "visible");
            div.html(d.name + "<br/><p>" + d.fraction_published*100 + "% published</p>")
                .style("left", (d3.event.pageX - 80) + "px")
                .style("top", (d3.event.pageY - 75) + "px");
            })
        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("visibility", "hidden");
        });
        // .on('mouseover', tip.show) //Added
        // .on('mouseout', tip.hide); //Added
        // .on('dblclick', this.connectedNodes(node, link)); //Added code

    //Now we are giving the SVGs co-ordinates - the force layout is generating the co-ordinates which this code is using to update the attributes of the SVG elements
    force.on("tick", function () {
        link.attr("x1", function (d) {
            return d.source.x;
        })
            .attr("y1", function (d) {
            return d.source.y;
        })
            .attr("x2", function (d) {
            return d.target.x;
        })
            .attr("y2", function (d) {
            return d.target.y;
        });

        node.attr("cx", function (d) {
            return d.x;
        })
            .attr("cy", function (d) {
            return d.y;
        });
    });

    var optArray = [];
    for (var i = 0; i < graph.nodes.length - 1; i++) {
        optArray.push(graph.nodes[i].name);
    }

    optArray = optArray.sort();


  }

  searchNode() {
    // console.log('click');
    // console.log(this.state.graph.nodes[0].group)
      // find the node
    var selectedVal = document.getElementById('node-search').value;
    var node = this.state.svg.selectAll(".node");

    if (selectedVal === "none") {
        node.style("stroke", "white").style("stroke-width", "1");
    } else {
        var selected = node.filter(function (d, i) {
            return d.name !== selectedVal;
        });
        selected.style("opacity", "0");
        var link = this.state.svg.selectAll(".link")
        link.style("opacity", "0");
        d3.selectAll(".node, .link").transition()
            .duration(1000)
            .style("opacity", 1);
    }


    // if (this.state.graph === mis) {
    //   this.setState({
    //     graph: mis2,
    //   });
    // } else if (this.state.graph === mis2) {
    //   this.setState({
    //     graph: mis,
    //   });
    // }
  }

  searchGroup(selectedVal) {
    // console.log('click');
      // find the node
    // var selectedVal = document.getElementById('search').value;
    var node = this.state.svg.selectAll(".node");

    if (selectedVal === "none") {
        node.style("stroke", "white").style("stroke-width", "1");
    } else {
        var selected = node.filter(function (d, i) {
            return d.group !== selectedVal;
        });
        selected.style("opacity", "0");
        var link = this.state.svg.selectAll(".link")
        link.style("opacity", "0");
        d3.selectAll(".node, .link").transition()
            .duration(1000)
            .style("opacity", 1);
    }
  }


  render (props) {
    // console.log('render: ', this.props);
    // console.log('constructor: ', this.state.data);

    return (
      <div>
        {/* <h3 className="f2 comp-title"> <strong>Under Construction!</strong> ...but feel free to play with the squidies (i.e. clinical trial funder-drug relationships) in the mean time! </h3> */}

        {/* <div className="column explore-btn-wrapper"> */}
          {explore ? (
            <div className="column explore-btn-wrapper">
              {/* // <img className="dory-gif" src={veryImportantGif2} alt="Come here little squishy"/> */}
              <NodeSearch graph={store.getState().scatterState.graphData}/>
              {/* <input id="node-search"/> */}
              <button className="button testy" onClick={() => this.searchNode()}>Search For One</button>
              <button className="button secondary" onClick={() => this.searchGroup(1)}>Select Drugs</button>
            </div>
          ) : (null)}
        {/* </div> */}


        {/* <Chart /> */}
        {/* {this.renderForceDiagram(this.props.graphData)} */}
        <g className="force-diagram-wrapper" ref="forceDiagram" transform={this.props.translate} ></g>

        <div className="column explore-btn-wrapper">
            <button className="button explore-relationships-btn" onClick={this.renderButton.bind(this)}><strong>Explore!</strong></button>
        </div>


        {/* <button className="button" onClick={this.updateData} /> */}

        {/* <img src={veryImportantGif} alt="and you shall be my squishy"/> */}


      </div>
    )
  }
}


// https://github.com/reactjs/react-autocomplete
class NodeSearch extends React.Component {
  constructor(props){
    super();
    this.state = {
      value: 'national cancer institute (nci)'
    }
  }
  // This + renderMenu (in Autocomplete) will make a custom formatted dropdown menu
  // renderItems(items) {
  //   // console.log(items)
  //   return items.map((item, index) => {
  //     var text = item.props.children
  //     if (index === 0 || items[index - 1].props.children.charAt(0) !== text.charAt(0)) {
  //       var style = {
  //         background: '#eee',
  //         color: '#454545',
  //         padding: '2px 6px',
  //         fontWeight: 'bold'
  //       }
  //       return [<div style={style}>{text.charAt(0)}</div>, item]
  //     }
  //     else {
  //       return item
  //     }
  //   })
  // }

  render(props) {
    // console.log('autocomplete props', this.props.graph.nodes);
    return (
      <span>
        <label htmlFor="node-search">Select A Node</label>
        <Autocomplete
          value={this.state.value}
          inputProps={{name: "Sponsor Node", id: "node-search"}}
          items={this.props.graph.nodes}
          getItemValue={(item) => item.name}
          shouldItemRender={matchStateToTerm}
          sortItems={sortStates}
          onChange={(event, value) => this.setState({ value })}
          onSelect={value => this.setState({ value })}
          renderItem={(item, isHighlighted) => (
            <div
              style={isHighlighted ? styles.highlightedItem : styles.item}
              key={item.abbr}
            >{item.name}</div>
          )}
          // renderMenu={(items, value, style) => (
          //   <div style={{...styles.menu, ...style}}>
          //     {value === '' ? (
          //       <div style={{padding: 6}}>Type of the name of a United State</div>
          //     ) : items.length === 0 ? (
          //       <div style={{padding: 6}}>No matches for {value}</div>
          //     ) : this.renderItems(items)}
          //   </div>
          // )}
        />
      </span>
    )
  }
}
