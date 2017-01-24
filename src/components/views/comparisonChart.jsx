import React from 'react';
import {VictoryPie, VictoryScatter, VictoryArea, VictoryAxis, VictoryTooltip, VictoryVoronoiTooltip, VictoryLine, VictoryLabel, VictoryBar, VictoryGroup, VictoryStack, VictoryChart} from 'victory';
// import {PieChart, Pie, Legend} from 'recharts';
// import {ComposedChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
// import Chart from '../containers/scatter/chart.jsx';


export default class ComparisonChart extends React.Component {
  componentDidMount() {
    // console.log("this.props:", this.props);
  }

	render () {
    // const sampleData = [
    // {year: 2006, unpublished: 0, published: 0, ongoing: 0, male: 0, female: 0, both: 0, na: 0},
    // {year: 2006, unpublished: 0, published: 0,  ongoing: 0, male: 0, female: 0, both: 0, na: 0},
    // ];

    // console.log("props:", props);
    // console.log("this.props:", this.props.lineData);

    let publishedRadiusScale = (this.props.pieData[this.props.year].status[0].trials / (this.props.maxPieSize+1)) * 155;
    let unpublishedRadiusScale = (this.props.pieData[this.props.year].status[1].trials / (this.props.maxPieSize+1)) * 155;
    let ongoingRadiusScale = (this.props.pieData[this.props.year].status[2].trials / (this.props.maxPieSize+1)) * 155;
    // console.log("scale ", this.props.year, publishedRadiusScale, unpublishedRadiusScale, ongoingRadiusScale);


  	return (
      <div className="comparison-panel large-3 medium-3 small-12 end columns">
        <h6>{this.props.query}</h6>
        <svg viewBox="0 0 400 400" >
          <VictoryLabel x={0} y={15}
            style={{
              fontSize: 16}}
            text={"Dinosaurs"}
          />
          <VictoryLabel x={300} y={0}
            style={{
              fontSize: 40,
              fontWeight: 400}}
            text={this.props.year}
          />
          <VictoryPie
            name={"Published"}
            // standalone={false}
            // data={[
            //   {gender: "female", fraction_trials: 33, fraction_size: 33}, //this.props.pieData[this.props.year].gender = [{},{},{}]
            //   {gender: "both", fraction_trials: 33, fraction_size: 33},
            //   {gender: "male", fraction_trials: 33, fraction_size: 33}
            // ]}
            data={this.props.pieData[this.props.year].published}
            x="gender"
            y={(datum) => datum.trials}
            startAngle={0} endAngle={120}
            label={false}
            // labelComponent={<VictoryTooltip/>}
            style={{ labels: { fontSize: 18, fill: "white"}}}
            padding={{top: 175-publishedRadiusScale, bottom: 175-publishedRadiusScale}} // More scaling = smaller pie
            // cornerRadius={50}
          />
          <VictoryPie
            name={"Unpublished"}
            // standalone={false}
            width={400} height={400}
            // data={[
            //   {gender: "female", fraction_trials: 33, fraction_size: 33}, //this.props.pieData[this.props.year] = [{},{},{}]
            //   {gender: "both", fraction_trials: 33, fraction_size: 33},
            //   {gender: "male", fraction_trials: 33, fraction_size: 33}
            // ]}
            data={this.props.pieData[this.props.year].unpublished}
            x="gender"
            y={(datum) => datum.trials}
            colorScale={"cool"}
            // innerRadius={20}
            labelRadius={unpublishedRadiusScale}
            startAngle={120} endAngle={240}
            padding={{top: 175-unpublishedRadiusScale, bottom: 175-unpublishedRadiusScale}} // More scaling = smaller pie
            style={{ labels: { fontSize: 20, fill: "white"}}}
          />
          <VictoryPie
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
            colorScale={"warm"}
            x="gender"
            y={(datum) => datum.trials}
            // innerRadius={20}
            labelRadius={100}
            startAngle={240} endAngle={360}
            padding={{top: 175-ongoingRadiusScale, bottom: 175-ongoingRadiusScale}} // More scaling = smaller pie

            style={{ labels: { fontSize: 20, fill: "white"}}}
          />
          <VictoryLabel
            textAnchor="middle" verticalAnchor="middle"
            x={200} y={200}
            style={{fontSize: 30}}
            text="Label"
          />
        </svg>

         <VictoryChart
           domain={{x: [this.props.startYear, this.props.endYear], y: [0, this.props.maxHeight]}}>
          <VictoryStack
            colorScale={["gold", "orange", "tomato"]}
          >
            <VictoryArea name="published"
              // data={[
              //   {title: "one", year: 2012, published: 1},
              //   {title: "two", year: 2013, published: 2},
              //   {title: "three", year: 2014, published: 2}
              // ]}
              data={this.props.lineData}

              x="year"
              y={(datum) => datum.published}
            />
            <VictoryArea name="unpublished"

              // data={[
              //   {title: "one", year: 2012, unpublished: 1},
              //   {title: "two",year: 2013, unpublished: 1},
              //   {title: "three", year: 2014, unpublished: 2}
              // ]}
              data={this.props.lineData}

              style={{
                // data: {fill: "tomato", opacity: 0.7},
                // labels: {fontSize: 12},
                // parent: {border: "1px solid #ccc"}
              }}
              x="year"
              y={(datum) => datum.unpublished}
            />
            <VictoryArea name="ongoing"

              // data={[
              //   {title: "one", year: 2012, ongoing: 1},
              //   {title: "two",year: 2013, ongoing: 1},
              //   {title: "three", year: 2014, ongoing: 2}
              // ]}
              data={this.props.lineData}

              x="year"
              y={(datum) => datum.ongoing}
            />
          </VictoryStack>

          {/* <VictoryAxis
            tickValues={this.props.allYears}
          />
          <VictoryAxis dependentAxis
            // domain={[0, 60000]}
            // offsetX={50}
            orientation="left"
            standalone={false}
            style={{}}
          /> */}

          {/* <VictoryLine
            style={{
              data: {stroke: "gray", strokeWidth: 2}
            }}
            data={[
              {x: this.props.year, y: -1},
              {x: this.props.year, y: 5} // MAKE THIS THE YEAR INDICATOR
            ]}
          /> */}

          <VictoryScatter // !!!!! Current Year indicator !
            data={[
              {x: this.props.year, y: -20},
            ]}
            symbol={"triangleUp"}
            size={10}
          />

          {/* <VictoryLine //Fake linechart to make a tooltip work
            data={[
              {x: 2012, y: 0},
              {x: 2013, y: 4},
              {x: 2014, y: 2}
            ]}
          /> */}
          <VictoryVoronoiTooltip
            // flyoutComponent={<CustomFlyout/>}
            labels={(d) => `Cumulative Trials \n published: ${d.published} \n unpublished: ${d.unpublished} \n ongoing: ${d.ongoing} \ntotal: ${d.total}`}
            // data={[
            //   {year: 2012, y: -0.001, published: 1, unpublished: 1, total: 2},
            //   {year: 2013, y: -0.001, published: 2, unpublished: 1, total: 3},
            //   {year: 2014, y: -0.001, published: 2, unpublished: 2, total: 4}
            // ]}
            data={this.props.lineData}
            x="year"
            y={(datum) => datum.y}
          />
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
