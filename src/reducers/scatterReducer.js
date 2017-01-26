import { GET_DATA_SCATTER, GET_DATA_BAR, CLEAR_STATE, GET_RELATIONSHIP_DATA} from '../actions/actions'; //, SEARCH_DATA_GENDER, CLEAR_STATE, SHOW_PUBLICATIONS
import _ from 'lodash';
// import d3 from 'd3';


// Copy data this way
    // // OMG THIS WORKS: copying data this way clones it so it doesnt mutate the original data
    // var newObject = $.extend(true, {}, dataRaw);  // import $ from 'jquery'
    //

  const data = [
        {year: 2006, unpublished: 0, published: 0, ongoing: 0, male: 0, female: 0, both: 0, na: 0},
        {year: 2007, unpublished: 0, published: 0, ongoing: 0, male: 0, female: 0, both: 0, na: 0},
        {year: 2008, unpublished: 0, published: 0, ongoing: 0, male: 0, female: 0, both: 0, na: 0},
        {year: 2009, unpublished: 0, published: 0, ongoing: 0, male: 0, female: 0, both: 0, na: 0},
        {year: 2010, unpublished: 0, published: 0, ongoing: 0, male: 0, female: 0, both: 0, na: 0},
        {year: 2011, unpublished: 0, published: 0, ongoing: 0, male: 0, female: 0, both: 0, na: 0},
        {year: 2012, unpublished: 0, published: 0, ongoing: 0, male: 0, female: 0, both: 0, na: 0},
        {year: 2013, unpublished: 0, published: 0, ongoing: 0, male: 0, female: 0, both: 0, na: 0},
        {year: 2014, unpublished: 0, published: 0, ongoing: 0, male: 0, female: 0, both: 0, na: 0},
        {year: 2015, unpublished: 0, published: 0, ongoing: 0, male: 0, female: 0, both: 0, na: 0},
        {year: 2016, unpublished: 0, published: 0, ongoing: 0, male: 0, female: 0, both: 0, na: 0},
        {year: 2017, unpublished: 0, published: 0, ongoing: 0, male: 0, female: 0, both: 0, na: 0},
    ];

// var stack = d3.layout.stack();

// Setting the default arguments for the initial state of scatter
const initialState = {
  // below is just creating a linear plot: [[0,0],[1,1], ...]
  data: _.range(50).map(function (x, i) { return [x,i] }),
  dataBar: data,
  showingPublication: true,
  graphData: {},
};


const rootReducer = function(state = initialState, action) {
  switch(action.type) {

    case GET_DATA_SCATTER:
      return Object.assign({}, state, {
        data: action.data
      })
    case GET_DATA_BAR:
      return Object.assign({}, state, {
        dataBar: action.data
      })
    case GET_RELATIONSHIP_DATA:
      return Object.assign({}, state, {
        graphData: action.graphData
      })
    // case SHOW_PUBLICATIONS:
    //   return Object.assign({}, state, {
    //     showingPublication: action.showingPublication
    //   })

    default:
      return state
  }

}
//
// // Saves each search query and the ids of the trials returned
// function searchSummary(state = {}, action) {
//   switch (action.type) {
//     case SEARCH_DATA_GENDER:
//       return Object.assign({}, state, {
//         [action.query]: items(state[action.query], action)
//         // Same as:
//         //   let nextState = {}
//         //   nextState[action.query] = posts(state[action.query], action)
//         //   return Object.assign({}, state, nextState)
//       })
//     default:
//       return state
//   }
// }

// To reset all default states
const scatterReducer = (state, action) => {
  if (action.type === CLEAR_STATE) {
    state = undefined
  }
  return rootReducer(state, action)
}

export default scatterReducer;
