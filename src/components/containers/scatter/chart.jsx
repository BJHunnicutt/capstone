// unfinished/src/components/chart.jsx
import React from 'react';
import ScatterPlot from './scatter-plot';

const styles = {
  width   : 500,
  height  : 300,
  // Only works when you fully reload the page
  // width : window.innerWidth / 2, // Testing out making the plot viewport responsive
  // height : 0.6 * window.innerWidth / 2,
  padding : 30,
};


// The number of data points for the chart.
const numDataPoints = 50;

// A function that returns a random number from 0 to 1000
const randomNum     = () => Math.floor(Math.random() * 1000);

// A function that creates an array of 50 elements of (x, y) coordinates.
const randomDataSet = () => {
  return Array.apply(null, {length: numDataPoints}).map(() => [randomNum(), randomNum()]);
}

export default class Chart extends React.Component{
  constructor(props) {
    super(props);
    this.state = { data: randomDataSet() };
  }

  randomizeData() {
    this.setState({ data: randomDataSet() });

  }

  render() {

    return <div>
      <h1>Playing With React and D3</h1>
      <ScatterPlot {...this.state} {...styles} />
      <div className="controls">
        <button className="button btn randomize" onClick={() => this.randomizeData()}>
          Randomize Data
        </button>
      </div>
    </div>
  }
}
