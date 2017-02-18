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
      linkedByIndex: [],
      color: d3.scale.category20(),
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
    // test
  }


// --------------------- neighbor node highlighting 2 ----------------------------- // http://bl.ocks.org/samuelleach/5497403
mouseOverFunction(d) {
  // console.log("mouseOverFunction this: ", this);
  var circle = this.state.svg.selectAll(".circle")
  var node = this.state.svg.selectAll(".node")
  var link = this.state.svg.selectAll(".link")

  node
    .transition()
      .duration(250)
      .attr("r", (o) => {
        if (this.isConnectedAsSource(o, d) || this.isConnectedAsTarget(o, d) || this.isEqual(o, d)) {
          return 1.4 * this.node_radius(o);
        } else {
          return this.node_radius(o);
        }
      })
      .style("opacity", (o) => {
        return this.isConnected(o, d) ? 1.0 : 0.2 ;
      })
      .style("fill", (o) => {
        let fillcolor;
        if (this.isConnectedAsSource(o, d)) {
          fillcolor = 'red';
        } else if (this.isConnectedAsTarget(o, d)) {
          fillcolor = 'blue';
        } else if (this.isEqual(o, d)) {
          fillcolor = "hotpink";
        } else {
          fillcolor = this.state.color(o.group);
        }
        return fillcolor;
      });

  link
    .transition()
      .duration(250)
      .style("stroke-opacity", (o) =>{
        return o.source === d || o.target === d ? 1 : 0.2;
      });

  // circle
  //   .transition(500)
  //     .attr("r", () => { return 1.4 * this.node_radius(d)});
}

mouseOutFunction(d) {
  var circle = this.state.svg.selectAll(".circle")
  var node = this.state.svg.selectAll(".node")
  var link = this.state.svg.selectAll(".link")


  node
    .transition()
    .duration(250)
      .attr("r", (d) => { return this.node_radius(d)})
      .style("fill", (o) => {
        let fillcolor;
        if (this.isConnectedAsSource(o, d)) {
          fillcolor = 'red';
        } else if (this.isConnectedAsTarget(o, d)) {
          fillcolor = 'blue';
        } else if (this.isEqual(o, d)) {
          fillcolor = "hotpink";
        } else {
          fillcolor = this.state.color(o.group);
        }
        return fillcolor;
      })
      .style("opacity", 1);

  link
    .transition(250)
    // .style("stroke-opacity", 0.8);

  // circle
  //   .transition(250)
}

isConnected(a, b) {
    return this.isConnectedAsTarget(a, b) || this.isConnectedAsSource(a, b) || a.index === b.index;
}

isConnectedAsSource(a, b) {
    return this.state.linkedByIndex[a.index + "," + b.index];
}

isConnectedAsTarget(a, b) {
    return this.state.linkedByIndex[b.index + "," + a.index];
}

isEqual(a, b) {
    return a.index === b.index;
}
// Node radius is proportional to the number of trials related to a node (to the power of 0.57 as per visual area perception work)
node_radius(d) { return Math.pow(20 * d.total, 0.57); }


// --------------------- end neighbor node highlighting 2 ----------------------------- //


  renderForceDiagram() {
    //Constants for the SVG
    // var width = 500, height = 500;
    let width = window.innerWidth * .96; // Testing out making the plot viewport responsive
    let height = 0.8 * window.innerHeight;

    //Set up the colour scale
    var color = this.state.color;

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
        .style("stroke-color", "red")
        // Stroke width is proportional to the number of trials between a drug and a sponsor
        .style("stroke-width", (d) => { return d.value * 1.5});

    //Do the same with the circles for the nodes - no
    let node = svg.selectAll(".node")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("class", "node")
        // Node Radius is proportional to the number of trials related to the node
        .attr("r", (d) => { return this.node_radius(d)})
        .style("fill", function (d) {
          return color(d.group);
        })
        .call(force.drag)
        .on("mouseover", (d) => {
            this.mouseOverFunction(d); // Neighbor node selection
            div.transition() // Tooltip show
                .duration(200)
                .style("visibility", "visible");
            div.html(`<strong> ${d.group===1 ? 'Drug: ' : 'Sponsor: '} </strong>` + d.name + "<br/><p>" + (d.fraction_published*100).toFixed(0) + "% published</p><p>" + d.total + `${d.total===1 ? ' trial' : ' trials'}` + " </p>") // Tooltip format
                .style("left", (d3.event.pageX - 80) + "px")
                .style("top", (d3.event.pageY - 75) + "px");
            })
        .on("mouseout", (d) => {
            this.mouseOutFunction(d); // Neighbor node selection
            div.transition() // Tooltip hide
                .duration(500)
                .style("visibility", "hidden");
        });
        // .on("mouseover", this.mouseOverFunction.bind(this))
        // .on("mouseout", this.mouseOutFunction.bind(this));

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


    // --------------------- neighbor node highlighting 2 ----------------------------- //
    var linkedByIndex = {};
    graph.links.forEach( (d) => {
      linkedByIndex[d.source.index + "," + d.target.index] = true;
      this.setState({
        linkedByIndex: linkedByIndex,
      });
    });
    // --------------------- end neighbor node highlighting 2 ----------------------------- //


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
