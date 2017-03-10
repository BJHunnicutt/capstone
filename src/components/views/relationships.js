import React from 'react';
// import ReactDOM from 'react-dom';
import d3 from 'd3';
// import allData from '../data/short_filtered.csv'
import store from '../../store';
import Autocomplete from 'react-autocomplete'
import { sortStates, matchStateToTerm, styles } from '../data/utils.js'
// import Chart from '../containers/scatter/chart.jsx';
// import veryImportantGif2 from '../../../public/dory2.gif'

// The graph:
  // - highlights nodes and neighbors on click
  // - highlights nodes and neighbors on search
  // - un-highlights all nodes if the canvas is clicked (non-node)
  // - limits node position to svg canvas size
  // - shows details tooltip on hover
  // - doesn't allow nodes to overlap (prevents node collision)


let explore = false; // The 'Explore!' button appears when false to give data time to load - switch to a lifecycle method later

// Default node colors
function colorScale(i) {
  let colors = ["", "rgb(200, 200, 200)", "rgb(50, 50, 50)"]; //I'm only accessing indeces 1 & 2
  return colors[i];
};
function colorScaleDim(i) {
  let colors = ["", "rgb(230, 230, 230)", "rgb(150, 150, 150)"];
  return colors[i];
};


export default class RelationshipsDiagram extends React.Component {
  constructor(props){
    super(); // "To get our context"
    this.state = {
      highlighting: false,   //highlighting stores whether the highlighting is on
      svg: '',
      linkedByIndex: [],
      // color: d3.scale.category20(),
      color: colorScale,
      colorDimmed: colorScaleDim,
      selectedFilter: false,
    }
    // console.log("constructor props: ", props);
  }

  // Show Force diagram
  renderButton() {
    this.renderForceDiagram();
    explore = true;
  }

  getPublicationColor(o, d) { // o is the node to color and d is the target node
    let fillcolor = 'rgba(255,255,255,0)';
    if (this.isConnectedAsSource(o, d) || this.isConnectedAsTarget(o, d) || this.isEqual(o, d)) {
      let greenScale = `rgb( ${Math.floor(255-( ((o.fraction_published-0.5)*2) *200))}, 255, ${Math.floor(255-( ((o.fraction_published-0.5)*2) *200))} )`;
      let redScale = `rgb(255, ${Math.floor(((o.fraction_published*2)*200))}, ${Math.floor(((o.fraction_published*2)*200))})`
      fillcolor = `${o.fraction_published > 0.5 ? greenScale : redScale}`;
    } else {
      fillcolor = 'rgba(255,255,255,0)';
    }
    return fillcolor;
  }

  // Either highlight selected nodes (d) or deselect all nodes (false)
  toggleNodeHighlight(d = false) {
    var node = this.state.svg.selectAll(".node")
    if (d) {
      node.style("stroke", (o) => 'rgba(255,255,255,0)');
      node.style("stroke", (o) => {
        d === o ? this.setState({ selectedFilter: o.name }) : null;
        return this.getPublicationColor(o, d)
      })

    } else {
      this.setState({ selectedFilter: false })
      node
        .transition()
          .duration(250)
          .style("stroke", (o) => 'rgba(255,255,255,0)')
          .style("fill", (o) => this.state.color(o.group))
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
    var circle = this.state.svg.selectAll(".circle")
    var node = this.state.svg.selectAll(".node")
    var link = this.state.svg.selectAll(".link")

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
          return this.isConnected(o, d) ? this.state.color(o.group) : this.state.colorDimmed(o.group) ;
        });
    link
      .transition()
        .duration(250)
        .style("stroke-opacity", (o) =>{
          return o.source === d || o.target === d ? 1 : 0.2;
        });

  }

  // Remove hover highlighting
  mouseOutFunction(d) {
    if (!this.state.highlighting) {
      var circle = this.state.svg.selectAll(".circle")
      var node = this.state.svg.selectAll(".node")
      var link = this.state.svg.selectAll(".link")

      node
        .transition()
        .duration(250)
          .attr("r", (d) => { return this.node_radius(d)})
          .style("fill", (o) => this.state.color(o.group))
      link
        .transition(250)
        .style("stroke-opacity", 0.5);
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
  node_radius(d) { return Math.pow(20 * d.total, 0.57); }


  renderForceDiagram() {
    //Constants for the SVG
    // var width = 500, height = 500;
    // let width = window.innerWidth * .96; // Testing out making the plot viewport responsive
    let width = ((window.innerWidth * 0.96) > (window.innerHeight * 0.55)) ? window.innerHeight * 0.55 : window.innerWidth * 0.96;
    let height = ((window.innerHeight * 0.55) < (window.innerWidth * 0.96)) ? window.innerHeight * 0.55 : window.innerWidth * 0.96;

    //Set up the colour scale
    var color = this.state.color;

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
        .attr("height", height);

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
        .style("stroke-color", "red")
        // Stroke width is proportional to the number of trials between a drug and a sponsor
        .style("stroke-width", (d) => { return d.value * 1.5});

    //Do the same with the circles for the nodes - no
    let node = svg.selectAll(".node")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("class", "node")
        // Node Radius is proportional to the number of trials related to the node
        .attr("r", (d) => {return this.node_radius(d)})
        .style("fill", (d) => {return color(d.group)})
        // .style("fill", (d) => this.getPublicationColor(d, d))
        .style("stroke-width", 2)
        .style("stroke", 'rgba(255,255,255,0)')
        .call(force.drag)
        .on("click", (d) => this.toggleNodeHighlight(d))
        .on("dblclick", (d) => this.toggleNodeHighlight(false))
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
    var linkedByIndex = {};
    graph.links.forEach( (d) => {
      linkedByIndex[d.source.index + "," + d.target.index] = true;
      this.setState({
        linkedByIndex: linkedByIndex,
      });
    });

  }

  // Calculates the distances to inhibit node collision
  collide(alpha) {
    let graph = store.getState().scatterState.graphData;
    var padding = 1; // separation between circles
    var quadtree = d3.geom.quadtree(graph.nodes);

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

    if (selectedVal === null) {
        node.style("stroke", "white").style("stroke-width", "1");
    } else {
        var selected = node.filter((d) => d.name === selectedVal);
        selected = selected[0][0].__data__;

        var unselected = node.filter((d, i) => {
          let connectedOrSelectedNode = this.isConnectedAsSource(d, selected) || this.isConnectedAsTarget(d, selected) || this.isEqual(d, selected);
          return !connectedOrSelectedNode;
        });

        unselected.style("opacity", "0");
        var link = this.state.svg.selectAll(".link")
        link.style("opacity", "0");
        setTimeout(() => {
          d3.selectAll(".node, .link").transition()
              .duration(500)
              .style("opacity", 1)
              .style("fill", (o) => this.state.color(o.group))
        }, 250); // without this the transition in toggleNodeHighlight() doesn't rerender properly

        this.toggleNodeHighlight(selected)
    }
  }

  searchGroup(selectedVal) {
    let node = this.state.svg.selectAll(".node");
    let link = this.state.svg.selectAll(".link")

    if (selectedVal === null) {
      node.style("stroke", "white").style("stroke-width", "1");
    } else if (selectedVal === 'all') {
      this.setState({ selectedFilter: 'All Drugs ans Trial Sponsors' })
      node.style("stroke", (o) => this.getPublicationColor(o, o));
    } else {
      if (selectedVal === 1) {
        this.setState({ selectedFilter: 'All Drugs' })
      } else {
        this.setState({ selectedFilter: 'All Trial Sponsors' })
      }
      let selected = node.filter((d) => d.group === selectedVal);
      selected
        // .style("stroke", 'black');
        .style("stroke", (d) => {
          let fillcolor;
          if (d.group === selectedVal) {
            let greenScale = `rgb( ${Math.floor(255-( ((d.fraction_published-0.5)*2) *200))}, 255, ${Math.floor(255-( ((d.fraction_published-0.5)*2) *200))} )`;
            let redScale = `rgb(255, ${Math.floor(((d.fraction_published*2)*200))}, ${Math.floor(((d.fraction_published*2)*200))})`
            fillcolor = `${d.fraction_published > 0.5 ? greenScale : redScale}`;
          } else {
            fillcolor = this.state.color(d.group);
          }
          return fillcolor;
        });

      var unselected = node.filter(function (d, i) {
          return d.group !== selectedVal;
      });
      unselected.style("opacity", "0");
      unselected.style("stroke", 'rgba(255,255,255,0)')

      link.style("opacity", "0");
      setTimeout(() => {
        d3.selectAll(".node, .link").transition()
            .duration(500)
            .style("opacity", 1)
            .style("fill", (o) => this.state.color(o.group))
      }, 250); // without this the node transition below doesn't rerender properly
    }

  }


  render (props) {
    // console.log('render: ', this.props);
    // console.log('constructor: ', this.state.data);

    return (
      <div className="relationships-diagram">
        {/* <h3 className="f2 comp-title"> <strong>Under Construction!</strong> ...but feel free to play with the squidies (i.e. clinical trial funder-drug relationships) in the mean time! </h3> */}

          {explore ? (
            <div>
              <h3 className="f2 centered filter-title">Explore Relationships Between Drug Trials and Their Sponsors </h3>

              <div className="column centered filter-wrapper">
                <div className="search-wrapper">
                  <h7 className="f2 rel-search-label">View Publication Rates For : </h7>
                  <div className="filter-buttons">
                    <button className="button secondary" onClick={() => this.searchGroup(1)}>Drugs</button>
                    <button className="button secondary" onClick={() => this.searchGroup(2)}>Sponsors</button>
                    <button className="button secondary" onClick={() => this.searchGroup('all')}>Both</button>
                  </div>
                  <div className="filter-search">
                    <NodeSearch graph={store.getState().scatterState.graphData}/>
                    <button className="button node-search-btn" onClick={() => this.searchNode()}>Search</button>
                  </div>
                </div>

              </div>
              {this.state.selectedFilter ? (
                <label className="f2 rel-current-search"> Current Search : <strong> {this.state.selectedFilter}</strong> </label>
              ) : (
                <label className="f2 rel-current-search"> Current Search : <i>(select a filter above OR click on the diagram below)</i> </label>
              )};
            </div>

          ) : (
            <div className="column explore-btn-wrapper">
                <button className="button explore-relationships-btn" onClick={this.renderButton.bind(this)}><strong>Explore!</strong></button>
            </div>
        )}

        <g className="force-diagram-wrapper" ref="forceDiagram" transform={this.props.translate} onClick={this.canvasClick.bind(this)}></g>
        {/* <button className="button" onClick={this.updateData} /> */}

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
    )
  }
}
