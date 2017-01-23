import React from 'react';
import {VictoryPie, VictoryScatter, VictoryArea, VictoryAxis, VictoryTooltip, VictoryVoronoiTooltip, VictoryLine, VictoryLabel, VictoryBar, VictoryGroup, VictoryStack, VictoryChart} from 'victory';
// import {PieChart, Pie, Legend} from 'recharts';
// import {ComposedChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
// import Chart from '../containers/scatter/chart.jsx';


export default class ComparisonChart extends React.Component {



	render () {
    // const sampleData = [
    // {year: 2006, unpublished: 0, published: 0, ongoing: 0, male: 0, female: 0, both: 0, na: 0},
    // {year: 2006, unpublished: 0, published: 0,  ongoing: 0, male: 0, female: 0, both: 0, na: 0},
    // ];

    // console.log("props:", props);
    // console.log("this.props:", this.props);

  	return (
        <div className="comparison-panel large-3 medium-3 small-12 end columns">
          <svg viewBox="0 0 400 400" >
            <VictoryLabel x={0} y={15}
              style={{
                fontSize: 16}}
              text={"Dinosaurs"}
            />
            <VictoryLabel x={300} y={15}
              style={{
                fontSize: 40,
                fontWeight: 400}}
              text={this.props.year}
            />
            <VictoryPie
              // standalone={false}
              data={[
                {month: "September", profit: 35000, loss: 2000},
                {month: "October", profit: 42000, loss: 8000},
                {month: "November", profit: 55000, loss: 5000}
              ]}
              x="month"
              y={(datum) => datum.profit - datum.loss}
              startAngle={0} endAngle={120}
              label={false}
              // labelComponent={<VictoryTooltip/>}
              style={{ labels: { fontSize: 18, fill: "white"}}}
              padding={{top: (1*this.props.radius), bottom: 1*this.props.radius}} // More scaling = smaller pie
              // cornerRadius={50}
            />
            <VictoryPie
              // standalone={false}
              width={400} height={400}
              data={[
                {x: "A", y: 33},
                {x: "B", y: 33},
                {x: "C", y: 33}
              ]}
              colorScale={"cool"}
              innerRadius={20} labelRadius={140-this.props.radius}
              startAngle={120} endAngle={240}
              padding={{top: 1*this.props.radius, bottom: 1*this.props.radius}} // More scaling = smaller pie
              style={{ labels: { fontSize: 20, fill: "white"}}}
            />
            <VictoryPie
              standalone={true}
              title={"Word"}
              width={400} height={400}
              data={[
                {x: "A", y: 33},
                {x: "B", y: 33},
                {x: "C", y: 33}
              ]}
              colorScale={"warm"}
              innerRadius={20} labelRadius={100}
              startAngle={240} endAngle={360}
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
             domain={{x: [2012, 2014], y: [0, 6]}}>
            <VictoryStack
              className={"test"}
              colorScale={["gold", "orange", "tomato"]}
            >
              <VictoryArea name="published"
                data={[
                  {title: "one", year: 2012, profit: 1},
                  {title: "two", year: 2013, profit: 2},
                  {title: "three", year: 2014, profit: 2}
                ]}
                x="year"
                y={(datum) => datum.profit}
              />
              <VictoryArea name="unpublished"

                data={[
                  {title: "one", year: 2012, profit: 1},
                  {title: "two",year: 2013, profit: 1},
                  {title: "three", year: 2014, profit: 2}
                ]}
                style={{
                  // data: {fill: "tomato", opacity: 0.7},
                  // labels: {fontSize: 12},
                  // parent: {border: "1px solid #ccc"}
                }}
                x="year"
                y={(datum) => datum.profit}
              />
            </VictoryStack>

            <VictoryAxis
              tickValues={[2012, 2013, 2014]}
            />
            <VictoryAxis dependentAxis
              // domain={[0, 60000]}
              // offsetX={50}
              orientation="left"
              standalone={false}
              style={{}}
            />
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
                {x: this.props.year, y: -1.2},
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
              flyoutComponent={<CustomFlyout/>}
              labels={(d) => `Cumulative Trials \n published: ${d.published} \n unpublished: ${d.unpublised} \n total: ${d.total}`}
              data={[
                {year: 2012, y: -0.001, published: 1, unpublised: 1, total: 2},
                {year: 2013, y: -0.001, published: 2, unpublised: 1, total: 3},
                {year: 2014, y: -0.001, published: 2, unpublised: 2, total: 4}
              ]}
              x="year"
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
