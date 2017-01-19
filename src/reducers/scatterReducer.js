import { GET_DATA_SCATTER, GET_DATA_BAR } from '../actions/actions';
import _ from 'lodash';
import d3 from 'd3';


// Copy data this way
    // // OMG THIS WORKS: copying data this way clones it so it doesnt mutate the original data
    // var newObject = $.extend(true, {}, dataRaw);  // import $ from 'jquery'
    //

  const data = [
        {year: 2005, unpublished: 4000, published: 2400, amt: 2400},
        {year: 2006, unpublished: 3000, published: 1398, amt: 2210},
        {year: 2007, unpublished: 2000, published: 9800, amt: 2290},
        {year: 2008, unpublished: 2780, published: 3908, amt: 2000},
        {year: 2009, unpublished: 1890, published: 4800, amt: 2181},
        {year: 2010, unpublished: 2390, published: 3800, amt: 2500},
        {year: 2011, unpublished: 3490, published: 4300, amt: 2100},
    ];

// var stack = d3.layout.stack();

// Setting the default arguments for the initial state of scatter
const initialState = {
  // below is just creating a linear plot: [[0,0],[1,1], ...]
  data: _.range(50).map(function (x, i) { return [x,i] }),
  dataBar: data,
};




const scatterReducer = function(state = initialState, action) {
  switch(action.type) {

    case GET_DATA_SCATTER:
      return Object.assign({}, state, {
        data: action.data
      })
    case GET_DATA_BAR:
      return Object.assign({}, state, {
        dataBar: action.data
      })

    default:
      return state
  }

}

export default scatterReducer;
