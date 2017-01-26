import React from 'react';
import {VictoryPie, VictoryTheme, VictoryScatter, VictoryArea, VictoryAxis, VictoryTooltip, VictoryVoronoiTooltip, VictoryLine, VictoryLabel, VictoryBar, VictoryGroup, VictoryStack, VictoryChart} from 'victory';
// import {PieChart, Pie, Legend} from 'recharts';
// import {ComposedChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
// import Chart from '../containers/scatter/chart.jsx';


export default class ComparisonChart extends React.Component {
  componentDidMount() {
    // console.log("this.props:", this.props);
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

	render () {
    // const sampleData = [
    // {year: 2006, unpublished: 0, published: 0, ongoing: 0, male: 0, female: 0, both: 0, na: 0},
    // {year: 2006, unpublished: 0, published: 0,  ongoing: 0, male: 0, female: 0, both: 0, na: 0},
    // ];

    // https://github.com/FormidableLabs/victory-core/blob/master/src/victory-util/style.js
    // const scales = {
    //   grayscale: [
    //     "#cccccc", "#969696", "#636363", "#252525"
    //   ],
    //   qualitative: [
    //     "#334D5C", "#45B29D", "#EFC94C", "#E27A3F", "#DF5A49",
    //     "#4F7DA1", "#55DBC1", "#EFDA97", "#E2A37F", "#DF948A"
    //   ],
    //   heatmap: ["#428517", "#77D200", "#D6D305", "#EC8E19", "#C92B05"],
    //   warm: ["#940031", "#C43343", "#DC5429", "#FF821D", "#FFAF55"],
    //   cool: ["#2746B9", "#0B69D4", "#2794DB", "#31BB76", "#60E83B"],
    //   red: ["#611310", "#7D1D1D", "#B02928", "#B02928", "#D86B67"],
    //   blue: ["#002C61", "#004B8F", "#006BC9", "#3795E5", "#65B4F4"],
    //   green: ["#354722", "#466631", "#649146", "#8AB25C", "#A9C97E"]
    // };

    // console.log("this.props:", this.props);

    // Raduis of the rose plots (i.e. % puplished and unpublished)
    //  **This number reference needs to change if the order of status to change
    let publishedRadiusScale = (this.props.pieData[this.props.year].status[1].trials / (this.props.maxPieSize+1));
    let unpublishedRadiusScale = (this.props.pieData[this.props.year].status[2].trials / (this.props.maxPieSize+1));
    let ongoingRadiusScale = (this.props.pieData[this.props.year].status[0].trials / (this.props.maxPieSize+1));
    // console.log("scale ", this.props.year, publishedRadiusScale, unpublishedRadiusScale, ongoingRadiusScale);

    let totalTrials = this.props.pieData[this.props.year].status[0].trials + this.props.pieData[this.props.year].status[1].trials + this.props.pieData[this.props.year].status[2].trials;
    let internal_publishedPercent = (this.props.pieData[this.props.year].status[1].trials / totalTrials)*100;
        // If under 1% ...
        internal_publishedPercent < 1 ? internal_publishedPercent = "<1" : internal_publishedPercent = internal_publishedPercent.toPrecision(2)
        // If 100% ...
        internal_publishedPercent > 99.9 ? internal_publishedPercent = ">99" : null
        // If looking before there are trials ...
        internal_publishedPercent === 'NaN' ? internal_publishedPercent = 0 : null

    let internal_unpublishedPercent = (this.props.pieData[this.props.year].status[2].trials / totalTrials)*100;
        // If under 1% ...
        internal_unpublishedPercent < 1 ? internal_unpublishedPercent = "<1" : internal_unpublishedPercent = internal_unpublishedPercent.toPrecision(2)
        // If 100% ...
        internal_unpublishedPercent > 99.1 ? internal_unpublishedPercent = ">99" : null
        // If looking before there are trials ...
        internal_unpublishedPercent === 'NaN' ? internal_unpublishedPercent = 0 : null

    let internal_ongoingPercent = (this.props.pieData[this.props.year].status[0].trials / totalTrials)*100;
        // If under 1% ...
        internal_ongoingPercent < 1 ? internal_ongoingPercent = "<1" : internal_ongoingPercent = (internal_ongoingPercent).toPrecision(2)
        // If 100% ...
        internal_ongoingPercent > 99.1 ? internal_ongoingPercent = ">99" : null
        // If looking before there are trials ...
        internal_ongoingPercent === 'NaN' ? internal_ongoingPercent = 0 : null

    // console.log("scale pub ", this.props.pieData[this.props.year].status[1].trials, " / ", totalTrials, " = ", internal_publishedRadiusScale);
    // console.log("scale unpub ", this.props.pieData[this.props.year].status[2].trials, " / ", totalTrials, " = ", internal_unpublishedRadiusScale);

  	return (
      <div className="comparison-panel large-3 medium-3 small-12 end columns">
        <h5 className="f2">{this.capitalizeFirstLetter(this.props.query)}</h5>
        <h6 className="f2">{this.props.year}</h6>
        <svg className="line-wrapper" viewBox="0 0 400 400" >
          <VictoryLabel x={0} y={-30}
            style={{
              fill: "#8AB25C",
              fontFamily: "'Exo', sans-serif",
              fontSize: 25,
              fontWeight: 400
            }}
            text={internal_publishedPercent + "% published"}
          />
          <VictoryLabel x={200} y={-30}
            style={{
              fill: "tomato",
              fontFamily: "'Exo', sans-serif",
              fontSize: 25,
              fontWeight: 400
            }}
            text={internal_unpublishedPercent+ "% unpublished"}
          />
          <VictoryLabel x={300} y={0}
            style={{
              fill: "gray",
              fontFamily: "'Exo', sans-serif",
              fontSize: 15,
              fontWeight: 200
            }}
            text={"*" + internal_ongoingPercent + "% ongoing"}
          />

          <VictoryPie
            name={"Published"}
            // animate={{duration: 300}}
            // standalone={false}
            // data={[
            //   {gender: "female", fraction_trials: 33, fraction_size: 33}, //this.props.pieData[this.props.year].gender = [{},{},{}]
            //   {gender: "both", fraction_trials: 33, fraction_size: 33},
            //   {gender: "male", fraction_trials: 33, fraction_size: 33}
            // ]}
            data={this.props.pieData[this.props.year].published}
            x="gender"
            y={(datum) => datum.trials}
            // label={true}
            // labelRadius={(publishedRadiusScale*155)+35}
            colorScale="green"
            // labelComponent={<VictoryTooltip/>}
            style={{ labels: {
              fontSize: 20,
              fill: (d) => {
                if (d.gender === "female") { return "#354722" }
                else if (d.gender === "both") { return "#466631" }
                else if (d.gender === "male") { return "#649146" }
                else if (d.gender === "na") { return "#8AB25C" }
              },
              visibility: (d) => {
                if (d.trials === 0) { return "hidden" }
                else { return "visible" }
              },
              padding: 10,
            }}}
            startAngle={180} endAngle={360}
            // label={(data) => "years x " + data.length }
            padding={{top: 175-(publishedRadiusScale*155), bottom: 175-(publishedRadiusScale*155)}} // More scaling = smaller pie
            // cornerRadius={50}
          />
          <VictoryPie
            name={"Unpublished"}
            animate={{duration: 300}}
            // standalone={false}
            // width={400} height={400}
            // data={[
            //   {gender: "female", fraction_trials: 33, fraction_size: 33}, //this.props.pieData[this.props.year] = [{},{},{}]
            //   {gender: "both", fraction_trials: 33, fraction_size: 33},
            //   {gender: "male", fraction_trials: 33, fraction_size: 33}
            // ]}
            data={this.props.pieData[this.props.year].unpublished}
            x="gender"
            y={(datum) => datum.trials}
            // label={true}
            colorScale={"warm"}
            // theme={VictoryTheme.warm}
            // innerRadius={20}
            // labelRadius={(unpublishedRadiusScale*155)+35}
            style={{ labels: {
              fontSize: 20,
              fill: (d) => {
                if (d.gender === "female") { return "#940031" } //warm: ["#940031", "#C43343", "#DC5429", "#FF821D", "#FFAF55"],
                else if (d.gender === "both") { return "#C43343" }
                else if (d.gender === "male") { return "#DC5429" }
                else if (d.gender === "na") { return "#FF821D" }
              },
              visibility: (d) => {
                if (d.trials === 0) { return "hidden" }
                else { return "visible" }
              },
              padding: 10,
            }}}
            startAngle={0} endAngle={180}
            padding={{top: 175-(unpublishedRadiusScale*155), bottom: 175-(unpublishedRadiusScale*155)}} // More scaling = smaller pie
          />
          {/* <VictoryPie
            name={"Ongoing"}
            standalone={true}
            title={"Word"}
            width={400} height={400}
            // data={[
            //   {gender: "female", fraction_trials: 133, fraction_size: 33}, //this.props.pieData[this.props.year] = [{},{},{}]
            //   {gender: "both", fraction_trials: 33, fraction_size: 33},
            //   {gender: "male", fraction_trials: 23, fraction_size: 23},
            //   {gender: "na", fraction_trials: 110, fraction_size: 10}
            // ]}
            data={this.props.pieData[this.props.year].ongoing}
            colorScale={"grayscale"}
            x="gender"
            y={(datum) => datum.trials}
            // innerRadius={20}
            labelRadius={100}
            startAngle={240} endAngle={360}
            padding={{top: 175-(ongoingRadiusScale*155), bottom: 175-(ongoingRadiusScale*155)}} // More scaling = smaller pie

            style={{ labels: { fontSize: 20, fill: "white"}}}
          /> */}
          {/* <VictoryLabel
            textAnchor="middle" verticalAnchor="middle"
            x={200} y={200}
            style={{fontSize: 30}}
            text="Label"
          /> */}
        </svg>

        <VictoryChart
           domain={{x: [this.props.startYear, this.props.endYear], y: [0, this.props.maxHeight]}}
           >
           <VictoryLabel x={20} y={30}
             style={{
              //  fill: "#8AB25C",
               fontFamily: "'Raleway', sans-serif",
               fontSize: 20,
               fontWeight: 200
             }}
             text="trials"
           />
          <VictoryStack
            colorScale={["lightgray", "yellowgreen", "tomato"]}
          >

            <VictoryArea name="ongoing"
              // data={[ {title: "one", year: 2012, ongoing: 1}, {title: "two",year: 2013, ongoing: 1}, ... ]}
              data={this.props.lineData}
              x="year"
              y={(datum) => datum.ongoing}
              label={"ongoing"}
              style={{ labels: {fontSize: 20, fill: "lightgray", padding: 35}}}
            />
            <VictoryArea name="published"
              // data={[ {title: "one", year: 2012, ongoing: 1}, {title: "two",year: 2013, ongoing: 1}, ... ]}
              data={this.props.lineData}
              x="year"
              y={(datum) => datum.published}
              label={"published"}
              style={{ labels: {fontSize: 20, fill: "yellowgreen", padding: 40}}}
            />
            <VictoryArea name="unpublished"
              // data={[ {title: "one", year: 2012, ongoing: 1}, {title: "two",year: 2013, ongoing: 1}, ... ]}
              data={this.props.lineData}
              style={{
                // data: {fill: "tomato", opacity: 0.7},
                // labels: {fontSize: 12},
                // parent: {border: "1px solid #ccc"}
              }}
              x="year"
              y={(datum) => datum.unpublished}
              label={"unpublished"}
              style={{ labels: {fontSize: 20, fill: "tomato", padding: 50}}}
            />
          </VictoryStack>

          <VictoryScatter // !!!!! Current Year indicator !
            data={[
              {x: this.props.year, y: -20},
            ]}
            symbol={"triangleUp"}
            size={10}
          />

          <VictoryVoronoiTooltip
            // To style the tooltip
            labelComponent={<VictoryTooltip
              cornerRadius={0}
              pointerLength={10}
              style={{fill: "black", fontSize: 20}}
              // flyoutComponent={<CustomFlyout/>}
              flyoutStyle={{fill: "rgb(237, 237, 237)", stroke: "rgba(0,0,0,0)", lineHeight: 1}}
            />}
            labels={(d) => `Published: ${d.published} \n Unpublished: ${d.unpublished} \n Ongoing: ${d.ongoing} \nTotal: ${d.total}`}
            // data={[ {year: 2012, y: -0.001, published: 1, unpublished: 1, total: 2}, ... ]}
            data={this.props.lineData}
            x="year"
            y={(datum) => datum.y}
            style={{
              fill: "white"
            }}
          />
          <VictoryAxis dependentAxis
            style={{
              axis: {stroke: "gray"},
              // axisLabel: {fontSize: 40, padding: 20},
              // grid: {stroke: (t) => t === 100 ? "red" : "grey", width: 10},
              // ticks: {stroke: "grey", width: 10},
              // tickLabels: {fontSize: 10, padding: 5}
            }}
          />
          <VictoryAxis style={{axis: {stroke: "gray"} }}/>
        </VictoryChart>
      </div>
    );
  }
}

class CustomFlyout extends React.Component {
  render() {
    const {x, y, orientation} = this.props;
    const newY = orientation === "top" ? y - 25 : y + 25;
    return (
      <g>
        <circle cx={x} cy={newY} r="20" stroke="tomato" fill="none"/>
        <circle cx={x} cy={newY} r="25" stroke="orange" fill="none"/>
        <circle cx={x} cy={newY} r="30" stroke="gold" fill="none"/>
      </g>
    );
  }
}

{/* <VictoryStack
  className={"test"}
  colorScale={["gold", "orange", "tomato"]}
  events={[{
    childName: ["published", "unpublished"],
    target: "data",
    eventHandlers: {
      onMouseOver: () => {
        return [
          {
            childName: ["published"],
            target: "data",
            mutation: (props) => {
              const fill = props.style.fill;
              return fill === "red" ? null : {style: {fill: "red", opacity: 0.7}};
            }
          }
        ];
      },
      onMouseOut: () => {
        return [
          {
            childName: ["published"],
            target: "data",
            mutation: (props) => {
              const fill = props.style.fill;
              return fill === "red" ? null : {style: {fill: "red", opacity: 0.7}};
            }
          }
        ];
      }
    }
  }]} */}
