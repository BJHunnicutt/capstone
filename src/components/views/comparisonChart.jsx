import React from 'react';
import {VictoryPie, VictoryLabel, VictoryBar, VictoryGroup, VictoryStack} from 'victory';
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
            <VictoryPie
              data={[
                {month: "September", profit: 35000, loss: 2000},
                {month: "October", profit: 42000, loss: 8000},
                {month: "November", profit: 55000, loss: 5000}
              ]}
              x="month"
              y={(datum) => datum.profit - datum.loss}
              startAngle={0} endAngle={120}
              padding={{top: 1*this.props.radius, bottom: 1*this.props.radius}} // More scaling = smaller pie
              // cornerRadius={50}
            />
            <VictoryPie
              standalone={true}
              width={400} height={400}
              data={[
                {x: "A", y: 33},
                {x: "B", y: 33},
                {x: "C", y: 33}
              ]}
              colorScale={"cool"}
              innerRadius={20} labelRadius={60}
              startAngle={120} endAngle={240}
              padding={{top: 1*this.props.radius, bottom: 1*this.props.radius}} // More scaling = smaller pie
              style={{ labels: { fontSize: 20, fill: "white"}}}
            />
            <VictoryPie
              standalone={true}
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
          {/* <PieChart width={800} height={400}>
            <Pie startAngle={90} endAngle={-90} isAnimationActive={false} data={this.state.dataR} cx={200} cy={200} outerRadius={this.state.pieRadius} fill="#8884d8"/>
            <Pie startAngle={90} endAngle={270} isAnimationActive={false} data={this.state.dataL} cx={200} cy={200} innerRadius={70} outerRadius={90} fill="#82ca9d" label/>
           </PieChart> */}

          <VictoryGroup
            events={[{
              childName: ["bar-1", "bar-2"],
              target: "data",
              eventHandlers: {
                onClick: () => {
                  return [
                    {
                      childName: ["bar-3", "bar-4"],
                      target: "data",
                      mutation: (props) => {
                        const fill = props.style.fill;
                        return fill === "gold" ? null : {style: {fill: "gold"}};
                      }
                    }
                  ];
                }
              }
            }]}
          >
          <VictoryStack>
            <VictoryBar name="bar-1"
              data={[{x: "a", y: 2}, {x: "b", y: 3}, {x: "c", y: 5}]}
            />
            <VictoryBar name="bar-2"
              data={[{x: "a", y: 1}, {x: "b", y: 4}, {x: "c", y: 5}]}
            />
            <VictoryBar name="bar-3"
              data={[{x: "a", y: 3}, {x: "b", y: 2}, {x: "c", y: 6}]}
            />
            <VictoryBar name="bar-4"
              data={[{x: "a", y: 2}, {x: "b", y: 3}, {x: "c", y: 3}]}
            />
          </VictoryStack>

        </VictoryGroup>
      </div>
    );
  }
}
