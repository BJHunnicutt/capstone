import * as types from '../actions/actionTypes';
import _ from 'lodash';


//Initialize with a random dataset// A function that returns a random number from 0 to 1000
  const randomNum     = () => Math.floor(Math.random() * 1000);
  // The number of data points for the chart.
  const numDataPoints = 50;
  // A function that creates an array of 50 elements of (x, y) coordinates.
  const randomDataSet = () => {
    return Array.apply(null, {length: numDataPoints}).map(() => [randomNum(), randomNum()]);
  }


// Setting the default arguments for the state of scatter
const initialState = {
  data: randomDataSet(),
};


const scatterReducer = function(state = initialState, action) {

  switch(action.type) {

    case types.GET_DATA_SCATTER:
      return Object.assign({}, state, {
        data: randomDataSet()
      });

    default:
      return state
  }

}

export default scatterReducer;
