import * as types from '../actions/actionTypes';
import _ from 'lodash';


// Setting the default arguments for the initial state of scatter
const initialState = {
  // below is just creating a linear plot: [[0,0],[1,1], ...]
  data: _.range(50).map(function (x, i) { return [x,i] }),
};


const scatterReducer = function(state = initialState, action) {
  switch(action.type) {

    case types.GET_DATA_SCATTER:
      return Object.assign({}, state, {
        data: action.data
      });

    default:
      return state
  }

}

export default scatterReducer;
