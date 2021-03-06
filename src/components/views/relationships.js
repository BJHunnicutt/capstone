import React from 'react';
// import ReactDOM from 'react-dom';
import d3 from 'd3';
// import allData from '../data/short_filtered.csv'
import store from '../../store';
import Autocomplete from 'react-autocomplete'
import { sortStates, matchStateToTerm, styles } from '../data/utils.js'
import _ from 'lodash'
import $ from 'jquery';
import RelationshipsTable from './relationshipsTable.js';
// import veryImportantGif2 from '../../../public/dory2.gif'

// The graph:
  // - highlights nodes and neighbors on click
  // - highlights nodes and neighbors on search
  // - un-highlights all nodes if the canvas is clicked (non-node)
  // - limits node position to svg canvas size
  // - shows details tooltip on hover
  // - doesn't allow nodes to overlap (i.e. prevents node collision)


let explore = false; // The 'Explore!' button appears when false to give data time to load - switch to a lifecycle method later

// Default node colors
function nodeColors(i) {
  let colors = ["", "rgb(200,200,200)", "rgb(50,50,50)"]; //I'm only accessing indeces 1 & 2
  return colors[i];
};
function nodeColorsDim(i) {
  let colors = ["", "rgb(230,230,230)", "rgb(150,150,150)"];
  return colors[i];
};

function linspace(start, end, n) {
    var out = [];
    var delta = (end - start) / (n - 1);

    var i = 0;
    while(i < (n - 1)) {
        out.push(start + (i * delta));
        i++;
    }

    out.push(end);
    return out;
}

// const colorRange = ['#7f3b08', '#b35806', '#e08214', '#fdb863', '#fee0b6', '#ffffff', '#d8daeb', '#b2abd2', '#8073ac', '#542788', '#2d004b'];
// const colorRange = ['#ff0000', '#ff8282', '#ffffff', '#82ff82', '#00ff00'];
const colorRange = ['#ff0000', '#bb0000', '#770000', '#007700', '#00bb00', '#00ff00'];

//Base the color scale on average temperature extremes (http://bl.ocks.org/nbremer/a43dbd5690ccd5ac4c6cc392415140e7)
var colorScale = d3.scale.linear()
	.domain(linspace(0, 100, colorRange.length))
	.range(colorRange);
	// .interpolate(d3.interpolateHcl);

// programatically generate the gradient for the legend
// this creates an array of [pct, colour] pairs as stop
// values for legend
var pct = linspace(0, 100, colorRange.length).map(function(d) {
    return Math.round(d) + '%';
});
var colourPct = d3.zip(pct, colorRange);


export default class RelationshipsDiagram extends React.Component {
  constructor(props){
    super(); // "To get our context"
    this.state = {
      highlighting: false,   //highlighting stores whether the highlighting is on
      svg: '',
      linkedByIndex: [],
      // color: d3.scale.category20(),
      nodeColor: nodeColors,
      nodeColorDimmed: nodeColorsDim,
      selectedFilter: false,
    }
    // console.log("constructor props: ", props);
  }

  componentDidMount() {
    // Allows a graph render if you click away and click back
    if ( explore === true) {
      this.renderButton();
    }
  }

  componentWillReceiveProps(nextProps) {
    // Once relationshipsPage.js passes props with sorted graph data (this != next)
    // this will render the graph (for slow connections) - explore button shown first
    if ((this.props.graphData !== nextProps.graphData) && explore === false) {
      _.defer(() => {
        const data = store.getState().scatterState.graphData
        if (_.isEmpty(data)) {
          explore = false;
        } else {
          explore = true;
          this.renderButton();
        }
      });
    }
  }

  // Show Force diagram
  renderButton() {
    this.renderForceDiagram();
    explore = true;
  }

  // Either highlight selected nodes (d) or deselect all nodes (false)
  toggleNodeHighlight(d = false) {
    var node = this.state.svg.selectAll(".node")
    var link = this.state.svg.selectAll(".link")

    if (d) {
      node.style("stroke", (o) => {
        if (d === o) this.setState({ selectedFilter: o.name });
        return this.isConnected(o, d) ? colorScale(o.fraction_published*100) : 'darkgray';
      });
      // node.style("fill", (o) => 'gold');
      node.style("stroke-width", (o) => {
        return this.isConnected(o, d) ? 2 : 1;
      });
      link
        .transition()
          .duration(250)
          .style("stroke", (o) => {
            return o.source === d || o.target === d ? "gray" : "lightgray";
          });

    } else {
      this.setState({ selectedFilter: false })
      node
        .transition()
          .duration(250)
          .style("stroke", (o) => 'darkgray')
          .style("fill", (o) => this.state.nodeColor(o.group))
      link
        .transition()
          .duration(250)
          .style("stroke", (o) => 'lightgray');

    }
  }

  // Deselect node and it's neighbors when clicking on canvas but not on a node
  canvasClick(e) {
    if (e.target.nodeName !== 'circle') {
      this.toggleNodeHighlight();
    };
  }

  // Highlight Neightbor nodes on hover --------- // http://bl.ocks.org/samuelleach/5497403
  mouseOverFunction(d) {
    // console.log("mouseOverFunction this: ", this);
    // var circle = this.state.svg.selectAll(".circle")
    var node = this.state.svg.selectAll(".node")

    node
      .transition()
        .duration(250)
        .attr("r", (o) => {
          if (this.isConnectedAsSource(o, d) || this.isConnectedAsTarget(o, d) || this.isEqual(o, d)) {
            return 1.3 * this.node_radius(o);
          } else {
            return this.node_radius(o);
          }
        })
        .style("fill", (o) => {
          return this.isConnected(o, d) ? this.state.nodeColor(o.group) : this.state.nodeColorDimmed(o.group) ;
        });

  }

  // Remove hover highlighting
  mouseOutFunction(d) {
    if (!this.state.highlighting) {
      // var circle = this.state.svg.selectAll(".circle")
      var node = this.state.svg.selectAll(".node")

      node
        .transition()
        .duration(250)
          .attr("r", (d) => { return this.node_radius(d)})
          .style("fill", (o) => this.state.nodeColor(o.group))
    }
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
  node_radius(d) { return 1 + Math.pow(13 * d.total, 0.41); } // 5 + (d.total/5) }


  renderForceDiagram() {
    //Constants for the SVG
    // var width = 500, height = 500;
    // let width = window.innerWidth * .96; // Testing out making the plot viewport responsive
    let width = ((window.innerWidth * 0.96) > (window.innerHeight * 0.5)) ? window.innerHeight * 0.5 : window.innerWidth * 0.96;
    let height = ((window.innerHeight * 0.5) < (window.innerWidth * 0.96)) ? window.innerHeight * 0.5 : window.innerWidth * 0.96;

    //Set up the colour scale
    var color = this.state.nodeColor;

    //Set up the force layout -- the physics
    var force = d3.layout.force()
        .charge(-90)
        .linkDistance(30)
        .gravity(0.2)
        .size([width, height]);


    // Define the div for the tooltip
    var div = d3.select(this.refs.forceDiagram).append("div")
        .attr("class", "rel-tooltip")
        .style("visibility", "hidden");

    //Append a SVG to the body of the html page. Assign this SVG as an object to svg
    var svg = d3.select(this.refs.forceDiagram)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("overflow", "visible"); //So you can see the legend and circle edges dont get cut off

    this.setState({
      svg: svg,
    });

    // let graph = this.state.graph;
    let graph = store.getState().scatterState.graphData;


    //Creates the graph data structure out of the json data
    force.nodes(graph.nodes)
        .links(graph.links)
        .start();

    //Create all the line svgs but without locations yet
    let link = svg.selectAll(".link")
        .data(graph.links)
        .enter().append("line")
        .attr("class", "link")
        .style("stroke", "lightgray")
        // Stroke width is proportional to the number of trials between a drug and a sponsor
        .style("stroke-width", (d) => { return ( 1 + (d.value * .5))});

    //Do the same with the circles for the nodes - no
    let node = svg.selectAll(".node")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("class", "node")
        // Node Radius is proportional to the number of trials related to the node
        .attr("r", (d) => {return this.node_radius(d)})
        .style("fill", (d) => {return color(d.group)})
        .style("stroke-width", 1)
        .style("stroke", 'darkgray')
        .call(force.drag)
        .on("click", (d) => this.toggleNodeHighlight(d))
        .on("dblclick", (d) => this.toggleNodeHighlight(false))
        .on("mouseover", (d) => {
            this.mouseOverFunction(d); // Neighbor node selection
            div.transition() // Tooltip show
              .duration(200)
              .style("visibility", "visible");
            div.html(
              `<strong> ${d.group===1 ? 'Drug : ' : 'Sponsor: '} </strong>`
              + _.startCase(_.toLower(d.name))
              + (d.group===1 ? '<br/> <strong> Brand Name : </strong>' : '')
              + (d.group===1 ? `<i> ${d.brandName} </i>` : '')
              + (d.group===1 ? '<br/> <strong> Type : </strong>' : '')
              + (d.group===1 ? `${d.actionType}` : '')
              + `<br/> <p class='percent-published' style=color:${colorScale(d.fraction_published*100)} >`
              + (d.fraction_published*100).toFixed(0)
              + "% published</p><p>" + d.total
              + `${d.total===1 ? ' trial' : ' trials'} </p>`
            ) // Tooltip format
              // .style("left", (d3.event.pageX - (width * 0.1)) + "px")
              // .style("top", (d3.event.pageY - (height * 0.35)) + "px");
              .style("left", (d3.event.pageX + 50 - (window.innerWidth * 0.2)) + "px")
              .style("top", (d3.event.pageY - 125 + (window.innerWidth * 0.03)) + "px");
            })
        .on("mouseout", (d) => {
            this.mouseOutFunction(d); // Neighbor node selection
            div.transition() // Tooltip hide
                .duration(500)
                .style("visibility", "hidden");
        });

    //Now we are giving the SVGs co-ordinates - the force layout is generating the co-ordinates which this code is using to update the attributes of the SVG elements
    force
      .on("tick", () => {
        node.each(this.collide(0.5)); // Inhibits node collision
        node
          .attr("cx", (d) => {
            return d.x = Math.max(this.node_radius(d), Math.min(width - this.node_radius(d), d.x)); // THis limits the nodes to the canvas bounds
          })
          .attr("cy", (d) => {
            return d.y = Math.max(this.node_radius(d), Math.min(height - this.node_radius(d), d.y));  // THis limits the nodes to the canvas bounds
          });
        link
          .attr("x1", function (d) {
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
      });


    var optArray = [];
    for (var i = 0; i < graph.nodes.length - 1; i++) {
        optArray.push(graph.nodes[i].name);
    }

    optArray = optArray.sort();


    // Used for neighbor node highlighting
    const linkedByIndex = {};
    graph.links.forEach( (d) => {
      linkedByIndex[d.source.index + "," + d.target.index] = true;
      this.setState({
        linkedByIndex: linkedByIndex,
      });
    });

    ///////////////////////////////////////////////////////////////////////////
    //////////////// Create the gradient for the legend ///////////////////////
    ///////////////////////////////////////////////////////////////////////////

    //Extra scale since the color scale is interpolated
    const tempScale = d3.scale.linear()
    	.domain([0, 100])
    	.range([0, width]);

    //Calculate the variables for the temp gradient
    const numStops = 4;
    const tempRange = tempScale.domain();
    tempRange[2] = tempRange[1] - tempRange[0];
    let tempPoint = [];
    for(let i = 0; i < numStops; i++) {
    	tempPoint.push(i * tempRange[2]/(numStops-1) + tempRange[0]);
    }//for i

    //Create the gradient
    var gradient = svg.append("defs")
    	.append("linearGradient")
    	.attr("id", "legend-publication")
    	.attr("x1", "0%").attr("y1", "0%")
    	.attr("x2", "100%").attr("y2", "0%")
    	// .selectAll("stop")
    	// .data(d3.range(numStops))
    	// .enter().append("stop")
    	// .attr("offset", function(d,i) { return tempScale( tempPoint[i] )/width; })
    	// .attr("stop-color", function(d,i) { return colorScale( tempPoint[i] ); });

    colourPct.forEach(function(d) {
        gradient.append('stop')
            .attr('offset', d[0])
            .attr('stop-color', d[1])
            .attr('stop-opacity', 1);
    });
    ///////////////////////////////////////////////////////////////////////////
    ////////////////////////// Draw the legend ////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    const legendWidth = Math.min(width/2, 400);

    //Color Legend container
    const legendsvg = svg.append("g")
    	.attr("class", "legendWrapper")
    	.attr("transform", "translate(" + width/2 + "," + (height + 30) + ")");

    //Draw the Rectangle
    legendsvg.append("rect")
    	.attr("class", "legendRect")
    	.attr("x", -legendWidth/2)
    	.attr("y", 0)
    	.attr("rx", 8/2)
    	.attr("width", legendWidth)
    	.attr("height", 8)
    	.style("fill", "url(#legend-publication)");

    //Append title
    legendsvg.append("text")
    	.attr("class", "legendTitle")
    	.attr("x", 0)
    	.attr("y", -10)
    	.style("text-anchor", "middle")
    	.text("Publication Rate");

    //Set scale for x-axis
    const xScale = d3.scale.linear()
    	 .range([-legendWidth/2, legendWidth/2])
    	 .domain([0,100] );

    //Define x-axis
    const xAxis = d3.svg.axis()
    	  .orient("bottom")
    	  .ticks(4)
    	  .tickFormat(function(d) { return d + "%"; })
    	  .scale(xScale);

    //Set up X axis
    legendsvg.append("g")
    	.attr("class", "axis")
    	.attr("transform", "translate(0," + (10) + ")")
    	.call(xAxis);



  }

  // Calculates the distances to inhibit node collision
  collide(alpha) {
    const graph = store.getState().scatterState.graphData;
    const padding = 1; // separation between circles
    const quadtree = d3.geom.quadtree(graph.nodes);

    return (d) => {
      var rb = 2*this.node_radius(d) + padding,
          nx1 = d.x - rb,
          nx2 = d.x + rb,
          ny1 = d.y - rb,
          ny2 = d.y + rb;
      quadtree.visit(function(quad, x1, y1, x2, y2) {
        if (quad.point && (quad.point !== d)) {
          var x = d.x - quad.point.x,
              y = d.y - quad.point.y,
              l = Math.sqrt(x * x + y * y);
            if (l < rb) {
            l = (l - rb) / l * alpha;
            d.x -= x *= l;
            d.y -= y *= l;
            quad.point.x += x;
            quad.point.y += y;
          }
        }
        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
      });
    };
  }

  searchNode() {
    // find the node
    var selectedVal = document.getElementById('node-search').value;

    var node = this.state.svg.selectAll(".node");
    this.setState({ selectedFilter: selectedVal })

    if (selectedVal === null || selectedVal === '') {
        node.style("stroke", "white").style("stroke-width", "1");
    } else {
        var selected = node.filter((d) => d.name === selectedVal);
        selected = selected[0][0].__data__;
        console.log('selected here', selected);

        var unselected = node.filter((d, i) => {
          let connectedOrSelectedNode = this.isConnectedAsSource(d, selected) || this.isConnectedAsTarget(d, selected) || this.isEqual(d, selected);
          return !connectedOrSelectedNode;
        });

        unselected.style("opacity", "0.25");
        var link = this.state.svg.selectAll(".link")
        link.style("opacity", "0.25");
        setTimeout(() => {
          d3.selectAll(".node, .link").transition()
              .duration(250)
              .style("opacity", 1)
              .style("fill", (o) => this.state.nodeColor(o.group))
        }, 150); // without this the transition in toggleNodeHighlight() doesn't rerender properly

        this.toggleNodeHighlight(selected)
    }
  }

  searchGroup(selectedVal) {
    let node = this.state.svg.selectAll(".node");
    let link = this.state.svg.selectAll(".link")

    if (selectedVal === null) {
      node.style("stroke", "white").style("stroke-width", "1");
    } else if (selectedVal === 'all') {
      this.setState({ selectedFilter: 'All Drugs and Trial Sponsors' })
      node.style("stroke", (o) => colorScale(o.fraction_published*100));
    } else {
      if (selectedVal === 1) {
        this.setState({ selectedFilter: 'All Drugs' })
      } else {
        this.setState({ selectedFilter: 'All Trial Sponsors' })
      }
      let selected = node.filter((d) => d.group === selectedVal);
      selected
        .style("stroke-width", 2)
        .style("stroke", (d) => {
          let fillcolor;
          if (d.group === selectedVal) {
            fillcolor = colorScale(d.fraction_published*100);
            // let greenScale = `rgb( ${Math.floor(255-( ((d.fraction_published-0.5)*2) *200))}, 255, ${Math.floor(255-( ((d.fraction_published-0.5)*2) *200))} )`;
            // let redScale = `rgb(255, ${Math.floor(((d.fraction_published*2)*200))}, ${Math.floor(((d.fraction_published*2)*200))})`
            // fillcolor = `${d.fraction_published > 0.5 ? greenScale : redScale}`;
          } else {
            fillcolor = this.state.nodeColor(d.group);
          }
          return fillcolor;
        });

      var unselected = node.filter(function (d, i) {
          return d.group !== selectedVal;
      });
      unselected.style("opacity", "0.25");
      unselected.style("stroke", 'darkgray')
      unselected.style("stroke-width", 1);

      link.style("opacity", "0.25");
      setTimeout(() => {
        d3.selectAll(".node, .link").transition()
            .duration(250)
            .style("opacity", 1)
            .style("fill", (o) => this.state.nodeColor(o.group))
      }, 150); // without this the node transition below doesn't rerender properly
    }

  }


  render (props) {
    const { svg } = this.state;
    const { selectedFilter } = this.state;
    const nodes = selectedFilter ? svg.selectAll(".node") : null;
    // console.log('render nodes', nodes);

    // console.log('render: ', this.props);
    // console.log('constructor: ', this.state.data);
    return (
      <div className="relationships-diagram">
        {/* <h3 className="f2 comp-title"> <strong>Under Construction!</strong> ...but feel free to play with the squidies (i.e. clinical trial funder-drug relationships) in the mean time! </h3> */}

          {explore ? (
            <div className="filter-wrapper-wrapper">
              <h4 className="f2 centered filter-title"> Explore Antidepressant Drug Trials and Their Sponsors </h4>

              <div className="column centered filter-wrapper">
                <div className="search-wrapper">
                  <h7 className="f2 rel-search-label">Select : </h7>
                  <div className="filter-buttons">
                    <button className="button dropdown-button" onClick={() => this.searchGroup(1)}>Drugs</button>
                    <button className="button" onClick={() => this.searchGroup(2)}>Sponsors</button>
                    <button className="button" onClick={() => this.searchGroup('all')}>Both</button>
                  </div>
                  <div className="filter-search">
                    <NodeSearch graph={store.getState().scatterState.graphData} searchNode={this.searchNode.bind(this)} />
                    <button className="button node-search-btn" onClick={() => this.searchNode()}>Search</button>
                  </div>
                </div>

              </div>
              {selectedFilter ? (
                <label className="f2 rel-current-search"> Current Search : <strong> {selectedFilter}</strong> </label>
              ) : (
                <label className="f2 rel-current-search"> Current Search : <i>(select a filter above OR click on the diagram below)</i> </label>
              )};
              {/* <p>{store.getState().scatterState.graphData}</p> */}
            </div>

          ) : (
            <div className="column explore-btn-wrapper">
                {/* <button className="button explore-relationships-btn" onClick={this.renderButton.bind(this)}><strong>Explore!</strong></button> */}
                <h4 className="f2 loading-notice">Just a second...  </h4>
            </div>
        )}

        <g className="force-diagram-wrapper" ref="forceDiagram" transform={this.props.translate} onClick={this.canvasClick.bind(this)}></g>
        {/* <button className="button" onClick={this.updateData} /> */}
        <div id="search-table-wrapper">
          {selectedFilter ? (
            <div>
              <label> Clinical Trials Related To : <strong> {selectedFilter}</strong> </label>
              <RelationshipsTable nodes={nodes} selectedFilter={selectedFilter}/>
            </div>
          ) : (
            <div>
              <label> Clinical Trials Related To : <i>(select a filter OR click on the diagram above)</i> </label>
              <RelationshipsTable nodes={nodes} selectedFilter={selectedFilter}/>
            </div>
          )}
        </div>
        <p className="f2 rel-data-description"> * Data includes only registered trials completed between 2006-2014, curated by <a href="https://github.com/ebmdatalab/trialstracker">TrialsTracker</a> <i>(this will be updated to use data from the <a href="https://fda.opentrials.net/search">OpenTrialsAPI</a> when the full version is released).</i> </p>
      </div>
    )
  }
}


// https://github.com/reactjs/react-autocomplete
class NodeSearch extends React.Component {
  constructor(props){
    super();
    this.state = {
      value: props.value
    }
  }
  // This + renderMenu (in Autocomplete) will make a custom formatted dropdown menu
  renderItems(items) {
    return items.map((item, index) => {
      // so you can't scroll when the dropdown menu is open
      $('body').css("overflow", "hidden");

      var text = item.props.children
      if (index === 0 || items[index - 1].props.children.charAt(0).toLowerCase() !== text.charAt(0).toLowerCase()) {
        // var style = {
        //   background: '#eee',
        //   color: '#454545',
        //   padding: '2px 6px',
        //   fontWeight: 'bold'
        // }
        // return [<div style={style}> {text.charAt(0).toLowerCase()} </div>, item];
        return item;
      }
      else {
        return item
      }
    })
  }

  selectOption(value) {
    value = value.replace(/\(.*\)/, '').trim();
    this.setState({ value })
    _.defer(() => this.props.searchNode());
  }

  deselect() {
    $('body').css("overflow", "scroll");
  }

  render(props) {
    // console.log('autocomplete props', this.props.graph.nodes);
    return (
        <Autocomplete
          value={this.state.value}
          inputProps={{name: "Sponsor Node", id: "node-search"}}
          // wrapperProps={{id: "node-search-list"}}
          items={ this.props.graph.nodes }
          getItemValue={(item) => item.allNames}
          shouldItemRender={matchStateToTerm}
          sortItems={sortStates}
          onMenuVisibilityChange={(isOpen) => {if (!isOpen) {this.deselect()} }}
          onChange={(event, value) => this.setState({ value })}
          onSelect={(value) => this.selectOption(value)}
          // onBlur={this.deselect()}
          // menuStyle={{width: '50px'}}
          renderItem={(item, isHighlighted) => (
            <div
              style={isHighlighted ? styles.highlightedItem : styles.item}
              key={item.allNames}
            >{item.allNames}</div>
          )}
          // renderMenu={(items, value, style) => {
          //   return <div style={{...style, ...this.menuStyle}} children={items}/>
          // }}
          renderMenu={(items, value, style) => (
            <div className="node-search-list" style={{...styles.menu, ...style}}>
              {/* {value === '' ? (
                <div style={{padding: 6}}>Type of the name of a Drug or Trial Sponsor</div> */}
              {items.length === 0 ? (
                <div style={{padding: 6}}>No matches for {value}</div>
              ) : this.renderItems(items) }
            </div>
          )}
        />
    )
  }
}
