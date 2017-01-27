import React from 'react';
// import ReactDOM from 'react-dom';
import d3 from 'd3';
// import allData from '../data/short_filtered.csv'
import store from '../../store';
// import Chart from '../containers/scatter/chart.jsx';
// import veryImportantGif from '../../../public/dory1.gif'
import veryImportantGif2 from '../../../public/dory2.gif'

let mis, mis2;
let explore = false;
export default class RelationshipsDiagram extends React.Component {
  constructor(props){
    super(); // "To get our context"
    this.state = {
      graph: mis,
      toggle: 0,   //Toggle stores whether the highlighting is on
      svg: '',
      data: props.data
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
    let graph = this.state.graph;
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

  searchNode(selectedVal) {
    // console.log('click');
    // console.log(this.state.graph.nodes[0].group)
      // find the node
    // var selectedVal = document.getElementById('search').value;
    // var node = this.state.svg.selectAll(".node");
    //
    // if (selectedVal == "none") {
    //     node.style("stroke", "white").style("stroke-width", "1");
    // } else {
    //     var selected = node.filter(function (d, i) {
    //         return d.name !== selectedVal;
    //     });
    //     selected.style("opacity", "0");
    //     var link = this.state.svg.selectAll(".link")
    //     link.style("opacity", "0");
    //     d3.selectAll(".node, .link").transition()
    //         .duration(1000)
    //         .style("opacity", 1);
    // }


    if (this.state.graph === mis) {
      this.setState({
        graph: mis2,
      });
    } else if (this.state.graph === mis2) {
      this.setState({
        graph: mis,
      });
    }
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
        <h3 className="f2 comp-title"> <strong>Under Construction!</strong> ...but feel free to play with the squidies (i.e. clinical trial funder-drug relationships) in the mean time! </h3>

        <div className="column explore-btn-wrapper">
          {explore ? (
            <img className="dory-gif" src={veryImportantGif2} alt="Come here little squishy"/>
          ) : (null)}
        </div>


        {/* <Chart /> */}
        {/* {this.renderForceDiagram(this.props.graphData)} */}
        <g className="force-diagram-wrapper" ref="forceDiagram" transform={this.props.translate} data={this.state.graph}></g>
        {/* <button className="button testy" onClick={() => this.searchNode('Valjean')}>Swap data</button> */}

        <div className="column explore-btn-wrapper">
            <button className="button explore-relationships-btn" onClick={this.renderButton.bind(this)}><strong>Explore!</strong></button>
        </div>

        {/* <button className="button secondary" onClick={() => this.searchGroup(1)}>Search group</button> */}

        {/* <button className="button" onClick={this.updateData} /> */}

        {/* <img src={veryImportantGif} alt="and you shall be my squishy"/> */}


      </div>
    )
  }
}




  // componentDidMount() {
  //   this.renderForceDiagram();
  // }
  //
  // updateData() {
  //   console.log('click');
  // }
  // renderForceDiagram() {
  //     var width = 500,
  //         height = 500
  //
  //     let nodeLocation = this.refs.forceDiagram;
  //
  //     let svg = d3.select(nodeLocation)
  //         .append("svg")
  //         .attr("class", "force-diagram")
  //         .attr("width", width)
  //         .attr("height", height);
  //
  //     var force = d3.layout.force()
  //         .gravity(.05)
  //         .distance(100)
  //         .charge(-100)
  //         .size([width, height]);
  //
  //     let graph = {"nodes":[
  //     		{"name":"node1","group":1},
  //     		{"name":"node2","group":2},
  //     		{"name":"node3","group":2},
  //     		{"name":"node4","group":3}
  //     	],
  //     	"links":[
  //     		{"source":2,"target":1,"weight":1},
  //     		{"source":0,"target":2,"weight":3}
  //     	]
  //     };
  //       // let graph = JSON.parse(testData);
  //     // d3.json("graphFile.json", function(graph) {
  //       force.nodes(graph.nodes)
  //           .links(graph.links)
  //           .start();
  //
  //       var link = svg.selectAll(".link")
  //           .data(graph.links)
  //         .enter().append("line")
  //           .attr("class", "link")
  //         .style("stroke-width", function(d) { return Math.sqrt(d.weight); });
  //
  //       var node = svg.selectAll(".node")
  //           .data(graph.nodes)
  //           .enter().append("g")
  //           .attr("class", "node")
  //           .call(force.drag);
  //
  //       node.append("circle")
  //           .attr("r","5");
  //
  //       node.append("text")
  //           .attr("dx", 12)
  //           .attr("dy", ".35em")
  //           .text(function(d) { return d.name });
  //
  //       force.on("tick", function() {
  //         link.attr("x1", function(d) { return d.source.x; })
  //             .attr("y1", function(d) { return d.source.y; })
  //             .attr("x2", function(d) { return d.target.x; })
  //             .attr("y2", function(d) { return d.target.y; });
  //
  //         node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  //       });
  //     // });
  //   }



  // const
  mis = {
        "nodes": [{
            "name": "Myriel",
                "group": 2
        }, {
            "name": "Napoleon",
                "group": 1
        }, {
            "name": "Mlle.Baptistine",
                "group": 1
        }, {
            "name": "Mme.Magloire",
                "group": 1
        }, {
            "name": "CountessdeLo",
                "group": 1
        }, {
            "name": "Geborand",
                "group": 1
        }, {
            "name": "Champtercier",
                "group": 1
        }, {
            "name": "Cravatte",
                "group": 1
        }, {
            "name": "Count",
                "group": 1
        }, {
            "name": "OldMan",
                "group": 1
        }, {
            "name": "Labarre",
                "group": 2
        }, {
            "name": "Valjean",
                "group": 2
        }, {
            "name": "Marguerite",
                "group": 3
        }, {
            "name": "Mme.deR",
                "group": 2
        }, {
            "name": "Isabeau",
                "group": 2
        }, {
            "name": "Gervais",
                "group": 2
        }, {
            "name": "Tholomyes",
                "group": 3
        }, {
            "name": "Listolier",
                "group": 3
        }, {
            "name": "Fameuil",
                "group": 3
        }, {
            "name": "Blacheville",
                "group": 3
        }, {
            "name": "Favourite",
                "group": 3
        }, {
            "name": "Dahlia",
                "group": 3
        }, {
            "name": "Zephine",
                "group": 3
        }, {
            "name": "Fantine",
                "group": 3
        }, {
            "name": "Mme.Thenardier",
                "group": 4
        }, {
            "name": "Thenardier",
                "group": 4
        }, {
            "name": "Cosette",
                "group": 5
        }, {
            "name": "Javert",
                "group": 4
        }, {
            "name": "Fauchelevent",
                "group": 0
        }, {
            "name": "Bamatabois",
                "group": 2
        }, {
            "name": "Perpetue",
                "group": 3
        }, {
            "name": "Simplice",
                "group": 2
        }, {
            "name": "Scaufflaire",
                "group": 2
        }, {
            "name": "Woman1",
                "group": 2
        }, {
            "name": "Judge",
                "group": 2
        }, {
            "name": "Champmathieu",
                "group": 2
        }, {
            "name": "Brevet",
                "group": 2
        }, {
            "name": "Chenildieu",
                "group": 2
        }, {
            "name": "Cochepaille",
                "group": 2
        }, {
            "name": "Pontmercy",
                "group": 4
        }, {
            "name": "Boulatruelle",
                "group": 6
        }, {
            "name": "Eponine",
                "group": 4
        }, {
            "name": "Anzelma",
                "group": 4
        }, {
            "name": "Woman2",
                "group": 5
        }, {
            "name": "MotherInnocent",
                "group": 0
        }, {
            "name": "Gribier",
                "group": 0
        }, {
            "name": "Jondrette",
                "group": 7
        }, {
            "name": "Mme.Burgon",
                "group": 7
        }, {
            "name": "Gavroche",
                "group": 8
        }, {
            "name": "Gillenormand",
                "group": 5
        }, {
            "name": "Magnon",
                "group": 5
        }, {
            "name": "Mlle.Gillenormand",
                "group": 5
        }, {
            "name": "Mme.Pontmercy",
                "group": 5
        }, {
            "name": "Mlle.Vaubois",
                "group": 5
        }, {
            "name": "Lt.Gillenormand",
                "group": 5
        }, {
            "name": "Marius",
                "group": 8
        }, {
            "name": "BaronessT",
                "group": 5
        }, {
            "name": "Mabeuf",
                "group": 8
        }, {
            "name": "Enjolras",
                "group": 8
        }, {
            "name": "Combeferre",
                "group": 8
        }, {
            "name": "Prouvaire",
                "group": 8
        }, {
            "name": "Feuilly",
                "group": 8
        }, {
            "name": "Courfeyrac",
                "group": 8
        }, {
            "name": "Bahorel",
                "group": 8
        }, {
            "name": "Bossuet",
                "group": 8
        }, {
            "name": "Joly",
                "group": 8
        }, {
            "name": "Grantaire",
                "group": 8
        }, {
            "name": "MotherPlutarch",
                "group": 9
        }, {
            "name": "Gueulemer",
                "group": 4
        }, {
            "name": "Babet",
                "group": 4
        }, {
            "name": "Claquesous",
                "group": 4
        }, {
            "name": "Montparnasse",
                "group": 4
        }, {
            "name": "Toussaint",
                "group": 5
        }, {
            "name": "Child1",
                "group": 10
        }, {
            "name": "Child2",
                "group": 10
        }, {
            "name": "Brujon",
                "group": 4
        }, {
            "name": "Mme.Hucheloup",
                "group": 8
        }],
            "links": [{
            "source": 1,
                "target": 0,
                "value": 1
        }, {
            "source": 2,
                "target": 0,
                "value": 8
        }, {
            "source": 3,
                "target": 0,
                "value": 10
        }, {
            "source": 3,
                "target": 2,
                "value": 6
        }, {
            "source": 4,
                "target": 0,
                "value": 1
        }, {
            "source": 5,
                "target": 0,
                "value": 1
        }, {
            "source": 6,
                "target": 0,
                "value": 1
        }, {
            "source": 7,
                "target": 0,
                "value": 1
        }, {
            "source": 8,
                "target": 0,
                "value": 2
        }, {
            "source": 9,
                "target": 0,
                "value": 1
        }, {
            "source": 11,
                "target": 10,
                "value": 1
        }, {
            "source": 11,
                "target": 3,
                "value": 3
        }, {
            "source": 11,
                "target": 2,
                "value": 3
        }, {
            "source": 11,
                "target": 0,
                "value": 5
        }, {
            "source": 12,
                "target": 11,
                "value": 1
        }, {
            "source": 13,
                "target": 11,
                "value": 1
        }, {
            "source": 14,
                "target": 11,
                "value": 1
        }, {
            "source": 15,
                "target": 11,
                "value": 1
       }, {
            "source": 19,
                "target": 17,
                "value": 4
        }, {
            "source": 19,
                "target": 18,
                "value": 4
        }, {
            "source": 20,
                "target": 16,
                "value": 3
        }, {
            "source": 20,
                "target": 17,
                "value": 3
        }, {
            "source": 20,
                "target": 18,
                "value": 3
        }, {
            "source": 20,
                "target": 19,
                "value": 4
        }, {
            "source": 21,
                "target": 16,
                "value": 3
        }, {
            "source": 21,
                "target": 17,
                "value": 3
        }, {
            "source": 21,
                "target": 18,
                "value": 3
        }, {
            "source": 21,
                "target": 19,
                "value": 3
        }, {
            "source": 21,
                "target": 20,
                "value": 5
        }, {
            "source": 22,
                "target": 16,
                "value": 3
        }, {
            "source": 22,
                "target": 17,
                "value": 3
        }, {
            "source": 22,
                "target": 18,
                "value": 3
        }, {
            "source": 22,
                "target": 19,
                "value": 3
        }, {
            "source": 22,
                "target": 20,
                "value": 4
        }, {
            "source": 22,
                "target": 21,
                "value": 4
        }, {
            "source": 23,
                "target": 16,
                "value": 3
        }, {
            "source": 23,
                "target": 17,
                "value": 3
        }, {
            "source": 23,
                "target": 18,
                "value": 3
        }, {
            "source": 23,
                "target": 19,
                "value": 3
        }, {
            "source": 23,
                "target": 20,
                "value": 4
        }, {
            "source": 23,
                "target": 21,
                "value": 4
        }, {
            "source": 23,
                "target": 22,
                "value": 4
        }, {
            "source": 23,
                "target": 12,
                "value": 2
        }, {
            "source": 23,
                "target": 11,
                "value": 9
        }, {
            "source": 24,
                "target": 23,
                "value": 2
        }, {
            "source": 24,
                "target": 11,
                "value": 7
        }, {
            "source": 25,
                "target": 24,
                "value": 13
        }, {
            "source": 25,
                "target": 23,
                "value": 1
        }, {
            "source": 25,
                "target": 11,
                "value": 12
        }, {
            "source": 26,
                "target": 24,
                "value": 4
        }, {
            "source": 26,
                "target": 11,
                "value": 31
        }, {
            "source": 26,
                "target": 16,
                "value": 1
        }, {
            "source": 26,
                "target": 25,
                "value": 1
        }, {
            "source": 27,
                "target": 11,
                "value": 17
        }, {
            "source": 27,
                "target": 23,
                "value": 5
        }, {
            "source": 27,
                "target": 25,
                "value": 5
        }, {
            "source": 27,
                "target": 24,
                "value": 1
        }, {
            "source": 27,
                "target": 26,
                "value": 1
        }, {
            "source": 28,
                "target": 11,
                "value": 8
        }, {
            "source": 28,
                "target": 27,
                "value": 1
        }, {
            "source": 29,
                "target": 23,
                "value": 1
        }, {
            "source": 29,
                "target": 27,
                "value": 1
        }, {
            "source": 29,
                "target": 11,
                "value": 2
        }, {
            "source": 30,
                "target": 23,
                "value": 1
        }, {
            "source": 31,
                "target": 30,
                "value": 2
        }, {
            "source": 31,
                "target": 11,
                "value": 3
        }, {
            "source": 31,
                "target": 23,
                "value": 2
        }, {
            "source": 31,
                "target": 27,
                "value": 1
        }, {
            "source": 32,
                "target": 11,
                "value": 1
        }, {
            "source": 33,
                "target": 11,
                "value": 2
        }, {
            "source": 33,
                "target": 27,
                "value": 1
        }, {
            "source": 34,
                "target": 11,
                "value": 3
        }, {
            "source": 34,
                "target": 29,
                "value": 2
        }, {
            "source": 35,
                "target": 11,
                "value": 3
        }, {
            "source": 35,
                "target": 34,
                "value": 3
        }, {
            "source": 35,
                "target": 29,
                "value": 2
        }, {
            "source": 36,
                "target": 34,
                "value": 2
        }, {
            "source": 36,
                "target": 35,
                "value": 2
        }, {
            "source": 36,
                "target": 11,
                "value": 2
        }, {
            "source": 36,
                "target": 29,
                "value": 1
        }, {
            "source": 37,
                "target": 34,
                "value": 2
        }, {
            "source": 37,
                "target": 35,
                "value": 2
        }, {
            "source": 37,
                "target": 36,
                "value": 2
        }, {
            "source": 37,
                "target": 11,
                "value": 2
        }, {
            "source": 37,
                "target": 29,
                "value": 1
        }, {
            "source": 38,
                "target": 34,
                "value": 2
        }, {
            "source": 38,
                "target": 35,
                "value": 2
        }, {
            "source": 38,
                "target": 36,
                "value": 2
        }, {
            "source": 43,
                "target": 26,
                "value": 1
        }, {
            "source": 43,
                "target": 27,
                "value": 1
        }, {
            "source": 44,
                "target": 28,
                "value": 3
        }, {
            "source": 44,
                "target": 11,
                "value": 1
        }, {
            "source": 45,
                "target": 28,
                "value": 2
        }, {
            "source": 47,
                "target": 46,
                "value": 1
        }, {
            "source": 48,
                "target": 47,
                "value": 2
        }, {
            "source": 48,
                "target": 25,
                "value": 1
        }, {
            "source": 48,
                "target": 27,
                "value": 1
        }, {
            "source": 48,
                "target": 11,
                "value": 1
        }, {
            "source": 49,
                "target": 26,
                "value": 3
        }, {
            "source": 49,
                "target": 11,
                "value": 2
        }, {
            "source": 50,
                "target": 49,
                "value": 1
        }, {
            "source": 50,
                "target": 24,
                "value": 1
        }, {
            "source": 51,
                "target": 49,
                "value": 9
        }, {
            "source": 51,
                "target": 26,
                "value": 2
        }, {
            "source": 51,
                "target": 11,
                "value": 2
        }, {
            "source": 54,
                "target": 49,
                "value": 1
        }, {
            "source": 54,
                "target": 26,
                "value": 1
        }, {
            "source": 55,
                "target": 51,
                "value": 6
        }, {
            "source": 55,
                "target": 49,
                "value": 12
        }, {
            "source": 55,
                "target": 39,
                "value": 1
        }, {
            "source": 55,
                "target": 54,
                "value": 1
        }, {
            "source": 55,
                "target": 26,
                "value": 21
        }, {
            "source": 55,
                "target": 11,
                "value": 19
        }, {
            "source": 55,
                "target": 16,
                "value": 1
        }, {
            "source": 55,
                "target": 25,
                "value": 2
        }, {
            "source": 55,
                "target": 41,
                "value": 5
        }, {
            "source": 55,
                "target": 48,
                "value": 4
        }, {
            "source": 56,
                "target": 49,
                "value": 1
        }, {
            "source": 56,
                "target": 55,
                "value": 1
        }, {
            "source": 57,
                "target": 55,
                "value": 1
        }, {
            "source": 57,
                "target": 41,
                "value": 1
        }, {
            "source": 57,
                "target": 48,
                "value": 1
        }, {
            "source": 58,
                "target": 55,
                "value": 7
        }, {
            "source": 58,
                "target": 48,
                "value": 7
        }, {
            "source": 58,
                "target": 27,
                "value": 6
        }, {
            "source": 58,
                "target": 57,
                "value": 1
        }, {
            "source": 58,
                "target": 11,
                "value": 4
        }, {
            "source": 59,
                "target": 58,
                "value": 15
        }, {
            "source": 59,
                "target": 55,
                "value": 5
        }, {
            "source": 59,
                "target": 48,
                "value": 6
        }, {
            "source": 59,
                "target": 57,
                "value": 2
        }, {
            "source": 60,
                "target": 48,
                "value": 1
        }, {
            "source": 60,
                "target": 58,
                "value": 4
        }, {
            "source": 60,
                "target": 59,
                "value": 2
        }, {
            "source": 61,
                "target": 48,
                "value": 2
        }, {
            "source": 61,
                "target": 58,
                "value": 6
        }, {
            "source": 61,
                "target": 60,
                "value": 2
        }, {
            "source": 61,
                "target": 59,
                "value": 5
        }, {
            "source": 62,
                "target": 58,
                "value": 17
        }, {
            "source": 62,
                "target": 59,
                "value": 13
        }, {
            "source": 62,
                "target": 48,
                "value": 7
        }, {
            "source": 62,
                "target": 57,
                "value": 2
        }, {
            "source": 62,
                "target": 41,
                "value": 1
        }, {
            "source": 62,
                "target": 61,
                "value": 6
        }, {
            "source": 62,
                "target": 60,
                "value": 3
        }, {
            "source": 63,
                "target": 59,
                "value": 5
        }, {
            "source": 64,
                "target": 48,
                "value": 5
        }, {
            "source": 64,
                "target": 63,
                "value": 4
        }, {
            "source": 64,
                "target": 58,
                "value": 10
        }, {
            "source": 64,
                "target": 61,
                "value": 6
        }, {
            "source": 64,
                "target": 60,
                "value": 2
        }, {
            "source": 64,
                "target": 59,
                "value": 9
        }, {
            "source": 64,
                "target": 57,
                "value": 1
        }, {
            "source": 64,
                "target": 11,
                "value": 1
        }, {
            "source": 65,
                "target": 63,
                "value": 5
        }, {
            "source": 65,
                "target": 64,
                "value": 7
        }, {
            "source": 65,
                "target": 48,
                "value": 3
        }, {
            "source": 65,
                "target": 62,
                "value": 5
        }, {
            "source": 65,
                "target": 58,
                "value": 5
        }, {
            "source": 65,
                "target": 61,
                "value": 5
        }, {
            "source": 65,
                "target": 60,
                "value": 2
        }, {
            "source": 65,
                "target": 59,
                "value": 5
        }, {
            "source": 65,
                "target": 57,
                "value": 1
        }, {
            "source": 65,
                "target": 55,
                "value": 2
        }, {
            "source": 66,
                "target": 64,
                "value": 3
        }, {
            "source": 66,
                "target": 58,
                "value": 3
        }, {
            "source": 66,
                "target": 59,
                "value": 1
        }, {
            "source": 66,
                "target": 62,
                "value": 2
        }, {
            "source": 66,
                "target": 65,
                "value": 2
        }, {
            "source": 66,
                "target": 48,
                "value": 1
        }, {
            "source": 66,
                "target": 63,
                "value": 1
        }, {
            "source": 66,
                "target": 61,
                "value": 1
        }, {
            "source": 66,
                "target": 60,
                "value": 1
        }, {
            "source": 67,
                "target": 57,
                "value": 3
        }, {
            "source": 68,
                "target": 25,
                "value": 5
        }, {
            "source": 68,
                "target": 11,
                "value": 1
        }, {
            "source": 68,
                "target": 24,
                "value": 1
        }, {
            "source": 68,
                "target": 27,
                "value": 1
        }, {
            "source": 68,
                "target": 48,
                "value": 1
        }, {
            "source": 68,
                "target": 41,
                "value": 1
        }, {
            "source": 69,
                "target": 25,
                "value": 6
        }, {
            "source": 69,
                "target": 68,
                "value": 6
        }, {
            "source": 69,
                "target": 11,
                "value": 1
        }, {
            "source": 69,
                "target": 24,
                "value": 1
        }, {
            "source": 69,
                "target": 27,
                "value": 2
        }, {
            "source": 69,
                "target": 48,
                "value": 1
        }, {
            "source": 69,
                "target": 41,
                "value": 1
        }, {
            "source": 70,
                "target": 25,
                "value": 4
        }, {
            "source": 70,
                "target": 69,
                "value": 4
        }, {
            "source": 70,
                "target": 68,
                "value": 4
        }, {
            "source": 70,
                "target": 11,
                "value": 1
        }, {
            "source": 70,
                "target": 24,
                "value": 1
        }, {
            "source": 70,
                "target": 27,
                "value": 1
        }, {
            "source": 70,
                "target": 41,
                "value": 1
        }, {
            "source": 70,
                "target": 58,
                "value": 1
        }, {
            "source": 71,
                "target": 27,
                "value": 1
        }, {
            "source": 71,
                "target": 69,
                "value": 2
        }, {
            "source": 71,
                "target": 68,
                "value": 2
        }, {
            "source": 71,
                "target": 70,
                "value": 2
        }, {
            "source": 71,
                "target": 11,
                "value": 1
        }, {
            "source": 71,
                "target": 48,
                "value": 1
        }, {
            "source": 71,
                "target": 41,
                "value": 1
        }, {
            "source": 71,
                "target": 25,
                "value": 1
        }, {
            "source": 72,
                "target": 26,
                "value": 2
        }, {
            "source": 72,
                "target": 27,
                "value": 1
        }, {
            "source": 72,
                "target": 11,
                "value": 1
        }, {
            "source": 73,
                "target": 48,
                "value": 2
        }, {
            "source": 74,
                "target": 48,
                "value": 2
        }, {
            "source": 74,
                "target": 73,
                "value": 3
        }, {
            "source": 75,
                "target": 69,
                "value": 3
        }, {
            "source": 75,
                "target": 68,
                "value": 3
        }, {
            "source": 75,
                "target": 25,
                "value": 3
        }, {
            "source": 75,
                "target": 48,
                "value": 1
        }, {
            "source": 75,
                "target": 41,
                "value": 1
        }, {
            "source": 75,
                "target": 70,
                "value": 1
        }, {
            "source": 75,
                "target": 71,
                "value": 1
        }, {
            "source": 76,
                "target": 64,
                "value": 1
        }, {
            "source": 76,
                "target": 65,
                "value": 1
        }, {
            "source": 76,
                "target": 66,
                "value": 1
        }, {
            "source": 76,
                "target": 63,
                "value": 1
        }, {
            "source": 76,
                "target": 62,
                "value": 1
        }, {
            "source": 76,
                "target": 48,
                "value": 1
        }, {
            "source": 76,
                "target": 58,
                "value": 1
        }]
    };

    // const
    mis2 = {
          "nodes": [{
              "name": "Myriel",
                  "group": 1
          }, {
              "name": "Napoleon",
                  "group": 1
          }, {
              "name": "Mlle.Baptistine",
                  "group": 1
          }, {
              "name": "Mme.Magloire",
                  "group": 1
          }, {
              "name": "CountessdeLo",
                  "group": 1
          }, {
              "name": "Geborand",
                  "group": 1
          }, {
              "name": "Champtercier",
                  "group": 1
          }, {
              "name": "Cravatte",
                  "group": 1
          }, {
              "name": "Count",
                  "group": 1
          }, {
              "name": "OldMan",
                  "group": 1
          }, {
              "name": "Labarre",
                  "group": 2
          }, {
              "name": "Valjean",
                  "group": 2
          }, {
              "name": "Marguerite",
                  "group": 3
          }, {
              "name": "Mme.deR",
                  "group": 2
          }, {
              "name": "Isabeau",
                  "group": 2
          }, {
              "name": "Gervais",
                  "group": 2
          }, {
              "name": "Tholomyes",
                  "group": 3
          }, {
              "name": "Listolier",
                  "group": 3
          }, {
              "name": "Fameuil",
                  "group": 3
          }, {
              "name": "Blacheville",
                  "group": 3
          }, {
              "name": "Favourite",
                  "group": 3
          }, {
              "name": "Dahlia",
                  "group": 3
          }, {
              "name": "Zephine",
                  "group": 3
          }, {
              "name": "Fantine",
                  "group": 3
          }, {
              "name": "Mme.Thenardier",
                  "group": 4
          }, {
              "name": "Thenardier",
                  "group": 4
          }, {
              "name": "Cosette",
                  "group": 5
          }, {
              "name": "Javert",
                  "group": 4
          }, {
              "name": "Fauchelevent",
                  "group": 0
          }, {
              "name": "Bamatabois",
                  "group": 2
          }, {
              "name": "Perpetue",
                  "group": 3
          }, {
              "name": "Simplice",
                  "group": 2
          }, {
              "name": "Scaufflaire",
                  "group": 2
          }, {
              "name": "Woman1",
                  "group": 2
          }, {
              "name": "Judge",
                  "group": 2
          }, {
              "name": "Champmathieu",
                  "group": 2
          }, {
              "name": "Brevet",
                  "group": 2
          }, {
              "name": "Chenildieu",
                  "group": 2
          }, {
              "name": "Cochepaille",
                  "group": 2
          }, {
              "name": "Pontmercy",
                  "group": 4
          }, {
              "name": "Boulatruelle",
                  "group": 6
          }, {
              "name": "Eponine",
                  "group": 4
          }, {
              "name": "Anzelma",
                  "group": 4
          }, {
              "name": "Woman2",
                  "group": 5
          }, {
              "name": "MotherInnocent",
                  "group": 0
          }, {
              "name": "Gribier",
                  "group": 0
          }, {
              "name": "Jondrette",
                  "group": 7
          }, {
              "name": "Mme.Burgon",
                  "group": 7
          }, {
              "name": "Gavroche",
                  "group": 8
          }, {
              "name": "Gillenormand",
                  "group": 5
          }, {
              "name": "Magnon",
                  "group": 5
          }, {
              "name": "Mlle.Gillenormand",
                  "group": 5
          }, {
              "name": "Mme.Pontmercy",
                  "group": 5
          }, {
              "name": "Mlle.Vaubois",
                  "group": 5
          }, {
              "name": "Lt.Gillenormand",
                  "group": 5
          }, {
              "name": "Marius",
                  "group": 8
          }, {
              "name": "BaronessT",
                  "group": 5
          }, {
              "name": "Mabeuf",
                  "group": 8
          }, {
              "name": "Enjolras",
                  "group": 8
          }, {
              "name": "Combeferre",
                  "group": 8
          }, {
              "name": "Prouvaire",
                  "group": 8
          }, {
              "name": "Feuilly",
                  "group": 8
          }, {
              "name": "Courfeyrac",
                  "group": 8
          }, {
              "name": "Bahorel",
                  "group": 8
          }, {
              "name": "Bossuet",
                  "group": 8
          }, {
              "name": "Joly",
                  "group": 8
          }, {
              "name": "Grantaire",
                  "group": 8
          }, {
              "name": "MotherPlutarch",
                  "group": 9
          }, {
              "name": "Gueulemer",
                  "group": 4
          }, {
              "name": "Babet",
                  "group": 4
          }, {
              "name": "Claquesous",
                  "group": 4
          }, {
              "name": "Montparnasse",
                  "group": 4
          }, {
              "name": "Toussaint",
                  "group": 5
          }, {
              "name": "Child1",
                  "group": 10
          }, {
              "name": "Child2",
                  "group": 10
          }, {
              "name": "Brujon",
                  "group": 4
          }, {
              "name": "Mme.Hucheloup",
                  "group": 8
          }],
              "links": [{
              "source": 1,
                  "target": 0,
                  "value": 1
          }, {
              "source": 2,
                  "target": 0,
                  "value": 8
          }, {
              "source": 3,
                  "target": 0,
                  "value": 10
          }, {
              "source": 3,
                  "target": 2,
                  "value": 6
          }, {
              "source": 4,
                  "target": 0,
                  "value": 1
          }, {
              "source": 5,
                  "target": 0,
                  "value": 1
          }, {
              "source": 6,
                  "target": 0,
                  "value": 1
          }, {
              "source": 7,
                  "target": 0,
                  "value": 1
          }, {
              "source": 8,
                  "target": 0,
                  "value": 2
          }, {
              "source": 9,
                  "target": 0,
                  "value": 1
          }, {
              "source": 11,
                  "target": 10,
                  "value": 1
          }, {
              "source": 11,
                  "target": 3,
                  "value": 3
          }, {
              "source": 11,
                  "target": 2,
                  "value": 3
          }, {
              "source": 11,
                  "target": 0,
                  "value": 5
          }, {
              "source": 12,
                  "target": 11,
                  "value": 1
          }, {
              "source": 13,
                  "target": 11,
                  "value": 1
          }, {
              "source": 14,
                  "target": 11,
                  "value": 1
          }, {
              "source": 15,
                  "target": 11,
                  "value": 1
          }, {
              "source": 17,
                  "target": 16,
                  "value": 4
          }, {
              "source": 18,
                  "target": 16,
                  "value": 4
          }, {
              "source": 18,
                  "target": 17,
                  "value": 4
          }, {
              "source": 19,
                  "target": 16,
                  "value": 4
          }, {
              "source": 19,
                  "target": 17,
                  "value": 4
          }, {
              "source": 19,
                  "target": 18,
                  "value": 4
          }, {
              "source": 20,
                  "target": 16,
                  "value": 3
          }, {
              "source": 20,
                  "target": 17,
                  "value": 3
          }, {
              "source": 20,
                  "target": 18,
                  "value": 3
          }, {
              "source": 20,
                  "target": 19,
                  "value": 4
          }, {
              "source": 21,
                  "target": 16,
                  "value": 3
          }, {
              "source": 21,
                  "target": 17,
                  "value": 3
          }, {
              "source": 21,
                  "target": 18,
                  "value": 3
          }, {
              "source": 21,
                  "target": 19,
                  "value": 3
          }, {
              "source": 21,
                  "target": 20,
                  "value": 5
          }, {
              "source": 22,
                  "target": 16,
                  "value": 3
          }, {
              "source": 22,
                  "target": 17,
                  "value": 3
          }, {
              "source": 22,
                  "target": 18,
                  "value": 3
          }, {
              "source": 22,
                  "target": 19,
                  "value": 3
          }, {
              "source": 22,
                  "target": 20,
                  "value": 4
          }, {
              "source": 22,
                  "target": 21,
                  "value": 4
          }, {
              "source": 23,
                  "target": 16,
                  "value": 3
          }, {
              "source": 23,
                  "target": 17,
                  "value": 3
          }, {
              "source": 23,
                  "target": 18,
                  "value": 3
          }, {
              "source": 23,
                  "target": 19,
                  "value": 3
          }, {
              "source": 23,
                  "target": 20,
                  "value": 4
          }, {
              "source": 23,
                  "target": 21,
                  "value": 4
          }, {
              "source": 23,
                  "target": 22,
                  "value": 4
          }, {
              "source": 23,
                  "target": 12,
                  "value": 2
          }, {
              "source": 23,
                  "target": 11,
                  "value": 9
          }, {
              "source": 24,
                  "target": 23,
                  "value": 2
          }, {
              "source": 24,
                  "target": 11,
                  "value": 7
          }, {
              "source": 25,
                  "target": 24,
                  "value": 13
          }, {
              "source": 25,
                  "target": 23,
                  "value": 1
          }, {
              "source": 25,
                  "target": 11,
                  "value": 12
          }, {
              "source": 26,
                  "target": 24,
                  "value": 4
          }, {
              "source": 26,
                  "target": 11,
                  "value": 31
          }, {
              "source": 26,
                  "target": 16,
                  "value": 1
          }, {
              "source": 26,
                  "target": 25,
                  "value": 1
          }, {
              "source": 27,
                  "target": 11,
                  "value": 17
          }, {
              "source": 27,
                  "target": 23,
                  "value": 5
          }, {
              "source": 27,
                  "target": 25,
                  "value": 5
          }, {
              "source": 27,
                  "target": 24,
                  "value": 1
          }, {
              "source": 27,
                  "target": 26,
                  "value": 1
          }, {
              "source": 28,
                  "target": 11,
                  "value": 8
          }, {
              "source": 28,
                  "target": 27,
                  "value": 1
          }, {
              "source": 29,
                  "target": 23,
                  "value": 1
          }, {
              "source": 29,
                  "target": 27,
                  "value": 1
          }, {
              "source": 29,
                  "target": 11,
                  "value": 2
          }, {
              "source": 30,
                  "target": 23,
                  "value": 1
          }, {
              "source": 31,
                  "target": 30,
                  "value": 2
          }, {
              "source": 31,
                  "target": 11,
                  "value": 3
          }, {
              "source": 31,
                  "target": 23,
                  "value": 2
          }, {
              "source": 31,
                  "target": 27,
                  "value": 1
          }, {
              "source": 32,
                  "target": 11,
                  "value": 1
          }, {
              "source": 33,
                  "target": 11,
                  "value": 2
          }, {
              "source": 33,
                  "target": 27,
                  "value": 1
          }, {
              "source": 34,
                  "target": 11,
                  "value": 3
          }, {
              "source": 34,
                  "target": 29,
                  "value": 2
          }, {
              "source": 35,
                  "target": 11,
                  "value": 3
          }, {
              "source": 35,
                  "target": 34,
                  "value": 3
          }, {
              "source": 35,
                  "target": 29,
                  "value": 2
          }, {
              "source": 36,
                  "target": 34,
                  "value": 2
          }, {
              "source": 36,
                  "target": 35,
                  "value": 2
          }, {
              "source": 36,
                  "target": 11,
                  "value": 2
          }, {
              "source": 36,
                  "target": 29,
                  "value": 1
          }, {
              "source": 37,
                  "target": 34,
                  "value": 2
          }, {
              "source": 37,
                  "target": 35,
                  "value": 2
          }, {
              "source": 37,
                  "target": 36,
                  "value": 2
          }, {
              "source": 37,
                  "target": 11,
                  "value": 2
          }, {
              "source": 37,
                  "target": 29,
                  "value": 1
          }, {
              "source": 38,
                  "target": 34,
                  "value": 2
          }, {
              "source": 38,
                  "target": 35,
                  "value": 2
          }, {
              "source": 38,
                  "target": 36,
                  "value": 2
          }, {
              "source": 38,
                  "target": 37,
                  "value": 2
          }, {
              "source": 38,
                  "target": 11,
                  "value": 2
          }, {
              "source": 38,
                  "target": 29,
                  "value": 1
          }, {
              "source": 39,
                  "target": 25,
                  "value": 1
          }, {
              "source": 40,
                  "target": 25,
                  "value": 1
          }, {
              "source": 41,
                  "target": 24,
                  "value": 2
          }, {
              "source": 41,
                  "target": 25,
                  "value": 3
          }, {
              "source": 42,
                  "target": 41,
                  "value": 2
          }, {
              "source": 42,
                  "target": 25,
                  "value": 2
          }, {
              "source": 42,
                  "target": 24,
                  "value": 1
          }, {
              "source": 43,
                  "target": 11,
                  "value": 3
          }, {
              "source": 43,
                  "target": 26,
                  "value": 1
          }, {
              "source": 43,
                  "target": 27,
                  "value": 1
          }, {
              "source": 44,
                  "target": 28,
                  "value": 3
          }, {
              "source": 44,
                  "target": 11,
                  "value": 1
          }, {
              "source": 45,
                  "target": 28,
                  "value": 2
          }, {
              "source": 47,
                  "target": 46,
                  "value": 1
          }, {
              "source": 48,
                  "target": 47,
                  "value": 2
          }, {
              "source": 48,
                  "target": 25,
                  "value": 1
          }, {
              "source": 48,
                  "target": 27,
                  "value": 1
          }, {
              "source": 48,
                  "target": 11,
                  "value": 1
          }, {
              "source": 49,
                  "target": 26,
                  "value": 3
          }, {
              "source": 49,
                  "target": 11,
                  "value": 2
          }, {
              "source": 50,
                  "target": 49,
                  "value": 1
          }, {
              "source": 50,
                  "target": 24,
                  "value": 1
          }, {
              "source": 51,
                  "target": 49,
                  "value": 9
          }, {
              "source": 51,
                  "target": 26,
                  "value": 2
          }, {
              "source": 51,
                  "target": 11,
                  "value": 2
          }, {
              "source": 52,
                  "target": 51,
                  "value": 1
          }, {
              "source": 52,
                  "target": 39,
                  "value": 1
          }, {
              "source": 53,
                  "target": 51,
                  "value": 1
          }, {
              "source": 54,
                  "target": 51,
                  "value": 2
          }, {
              "source": 54,
                  "target": 49,
                  "value": 1
          }, {
              "source": 54,
                  "target": 26,
                  "value": 1
          }, {
              "source": 55,
                  "target": 51,
                  "value": 6
          }, {
              "source": 55,
                  "target": 49,
                  "value": 12
          }, {
              "source": 55,
                  "target": 39,
                  "value": 1
          }, {
              "source": 55,
                  "target": 54,
                  "value": 1
          }, {
              "source": 55,
                  "target": 26,
                  "value": 21
          }, {
              "source": 55,
                  "target": 11,
                  "value": 19
          }, {
              "source": 55,
                  "target": 16,
                  "value": 1
          }, {
              "source": 55,
                  "target": 25,
                  "value": 2
          }, {
              "source": 55,
                  "target": 41,
                  "value": 5
          }, {
              "source": 55,
                  "target": 48,
                  "value": 4
          }, {
              "source": 56,
                  "target": 49,
                  "value": 1
          }, {
              "source": 56,
                  "target": 55,
                  "value": 1
          }, {
              "source": 57,
                  "target": 55,
                  "value": 1
          }, {
              "source": 57,
                  "target": 41,
                  "value": 1
          }, {
              "source": 57,
                  "target": 48,
                  "value": 1
          }, {
              "source": 58,
                  "target": 55,
                  "value": 7
          }, {
              "source": 58,
                  "target": 48,
                  "value": 7
          }, {
              "source": 58,
                  "target": 27,
                  "value": 6
          }, {
              "source": 58,
                  "target": 57,
                  "value": 1
          }, {
              "source": 58,
                  "target": 11,
                  "value": 4
          }, {
              "source": 59,
                  "target": 58,
                  "value": 15
          }, {
              "source": 59,
                  "target": 55,
                  "value": 5
          }, {
              "source": 59,
                  "target": 48,
                  "value": 6
          }, {
              "source": 59,
                  "target": 57,
                  "value": 2
          }, {
              "source": 60,
                  "target": 48,
                  "value": 1
          }, {
              "source": 60,
                  "target": 58,
                  "value": 4
          }, {
              "source": 60,
                  "target": 59,
                  "value": 2
          }, {
              "source": 61,
                  "target": 48,
                  "value": 2
          }, {
              "source": 61,
                  "target": 58,
                  "value": 6
          }, {
              "source": 61,
                  "target": 60,
                  "value": 2
          }, {
              "source": 61,
                  "target": 59,
                  "value": 5
          }, {
              "source": 61,
                  "target": 57,
                  "value": 1
          }, {
              "source": 61,
                  "target": 55,
                  "value": 1
          }, {
              "source": 62,
                  "target": 55,
                  "value": 9
          }, {
              "source": 62,
                  "target": 58,
                  "value": 17
          }, {
              "source": 62,
                  "target": 59,
                  "value": 13
          }, {
              "source": 62,
                  "target": 48,
                  "value": 7
          }, {
              "source": 62,
                  "target": 57,
                  "value": 2
          }, {
              "source": 62,
                  "target": 41,
                  "value": 1
          }, {
              "source": 62,
                  "target": 61,
                  "value": 6
          }, {
              "source": 62,
                  "target": 60,
                  "value": 3
          }, {
              "source": 63,
                  "target": 59,
                  "value": 5
          }, {
              "source": 63,
                  "target": 48,
                  "value": 5
          }, {
              "source": 63,
                  "target": 62,
                  "value": 6
          }, {
              "source": 63,
                  "target": 57,
                  "value": 2
          }, {
              "source": 63,
                  "target": 58,
                  "value": 4
          }, {
              "source": 63,
                  "target": 61,
                  "value": 3
          }, {
              "source": 63,
                  "target": 60,
                  "value": 2
          }, {
              "source": 63,
                  "target": 55,
                  "value": 1
          }, {
              "source": 64,
                  "target": 55,
                  "value": 5
          }, {
              "source": 64,
                  "target": 62,
                  "value": 12
          }, {
              "source": 64,
                  "target": 48,
                  "value": 5
          }, {
              "source": 64,
                  "target": 63,
                  "value": 4
          }, {
              "source": 64,
                  "target": 58,
                  "value": 10
          }, {
              "source": 64,
                  "target": 61,
                  "value": 6
          }, {
              "source": 64,
                  "target": 60,
                  "value": 2
          }, {
              "source": 64,
                  "target": 59,
                  "value": 9
          }, {
              "source": 64,
                  "target": 57,
                  "value": 1
          }, {
              "source": 64,
                  "target": 11,
                  "value": 1
          }, {
              "source": 65,
                  "target": 63,
                  "value": 5
          }, {
              "source": 65,
                  "target": 64,
                  "value": 7
          }, {
              "source": 65,
                  "target": 48,
                  "value": 3
          }, {
              "source": 65,
                  "target": 62,
                  "value": 5
          }, {
              "source": 65,
                  "target": 58,
                  "value": 5
          }, {
              "source": 65,
                  "target": 61,
                  "value": 5
          }, {
              "source": 65,
                  "target": 60,
                  "value": 2
          }, {
              "source": 65,
                  "target": 59,
                  "value": 5
          }, {
              "source": 65,
                  "target": 57,
                  "value": 1
          }, {
              "source": 65,
                  "target": 55,
                  "value": 2
          }, {
              "source": 66,
                  "target": 64,
                  "value": 3
          }, {
              "source": 66,
                  "target": 58,
                  "value": 3
          }, {
              "source": 66,
                  "target": 59,
                  "value": 1
          }, {
              "source": 66,
                  "target": 62,
                  "value": 2
          }, {
              "source": 66,
                  "target": 65,
                  "value": 2
          }, {
              "source": 66,
                  "target": 48,
                  "value": 1
          }, {
              "source": 66,
                  "target": 63,
                  "value": 1
          }, {
              "source": 66,
                  "target": 61,
                  "value": 1
          }, {
              "source": 66,
                  "target": 60,
                  "value": 1
          }, {
              "source": 67,
                  "target": 57,
                  "value": 3
          }, {
              "source": 68,
                  "target": 25,
                  "value": 5
          }, {
              "source": 68,
                  "target": 11,
                  "value": 1
          }, {
              "source": 68,
                  "target": 24,
                  "value": 1
          }, {
              "source": 68,
                  "target": 27,
                  "value": 1
          }, {
              "source": 68,
                  "target": 48,
                  "value": 1
          }, {
              "source": 68,
                  "target": 41,
                  "value": 1
          }, {
              "source": 69,
                  "target": 25,
                  "value": 6
          }, {
              "source": 69,
                  "target": 68,
                  "value": 6
          }, {
              "source": 69,
                  "target": 11,
                  "value": 1
          }, {
              "source": 69,
                  "target": 24,
                  "value": 1
          }, {
              "source": 69,
                  "target": 27,
                  "value": 2
          }, {
              "source": 69,
                  "target": 48,
                  "value": 1
          }, {
              "source": 69,
                  "target": 41,
                  "value": 1
          }, {
              "source": 70,
                  "target": 25,
                  "value": 4
          }, {
              "source": 70,
                  "target": 69,
                  "value": 4
          }, {
              "source": 70,
                  "target": 68,
                  "value": 4
          }, {
              "source": 70,
                  "target": 11,
                  "value": 1
          }, {
              "source": 70,
                  "target": 24,
                  "value": 1
          }, {
              "source": 70,
                  "target": 27,
                  "value": 1
          }, {
              "source": 70,
                  "target": 41,
                  "value": 1
          }, {
              "source": 70,
                  "target": 58,
                  "value": 1
          }, {
              "source": 71,
                  "target": 27,
                  "value": 1
          }, {
              "source": 71,
                  "target": 69,
                  "value": 2
          }, {
              "source": 71,
                  "target": 68,
                  "value": 2
          }, {
              "source": 71,
                  "target": 70,
                  "value": 2
          }, {
              "source": 71,
                  "target": 11,
                  "value": 1
          }, {
              "source": 71,
                  "target": 48,
                  "value": 1
          }, {
              "source": 71,
                  "target": 41,
                  "value": 1
          }, {
              "source": 71,
                  "target": 25,
                  "value": 1
          }, {
              "source": 72,
                  "target": 26,
                  "value": 2
          }, {
              "source": 72,
                  "target": 27,
                  "value": 1
          }, {
              "source": 72,
                  "target": 11,
                  "value": 1
          }, {
              "source": 73,
                  "target": 48,
                  "value": 2
          }, {
              "source": 74,
                  "target": 48,
                  "value": 2
          }, {
              "source": 74,
                  "target": 73,
                  "value": 3
          }, {
              "source": 75,
                  "target": 69,
                  "value": 3
          }, {
              "source": 75,
                  "target": 68,
                  "value": 3
          }, {
              "source": 75,
                  "target": 25,
                  "value": 3
          }, {
              "source": 75,
                  "target": 48,
                  "value": 1
          }, {
              "source": 75,
                  "target": 41,
                  "value": 1
          }, {
              "source": 75,
                  "target": 70,
                  "value": 1
          }, {
              "source": 75,
                  "target": 71,
                  "value": 1
          }, {
              "source": 76,
                  "target": 64,
                  "value": 1
          }, {
              "source": 76,
                  "target": 65,
                  "value": 1
          }, {
              "source": 76,
                  "target": 66,
                  "value": 1
          }, {
              "source": 76,
                  "target": 63,
                  "value": 1
          }, {
              "source": 76,
                  "target": 62,
                  "value": 1
          }, {
              "source": 76,
                  "target": 48,
                  "value": 1
          }, {
              "source": 76,
                  "target": 58,
                  "value": 1
          }]
      };
