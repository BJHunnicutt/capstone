import { combineReducers } from 'redux'
import {
  SELECT_SEARCH, FINALIZE_SEARCH, REQUEST_SEARCH, RECEIVE_SEARCH, FILTER_SEARCH, GET_RESULTS, SEARCH_TOO_BROAD, CLEAR_STATE, GET_CUMULATIVE_DATA
} from '../actions/actions'

import merge from 'lodash/merge'


// Save the last search (may change to current viewed)
function selectedQuery(state = {
  query: '',
  totalItems: 0,
  tooManyResults: false,
}, action) {
  switch (action.type) {
    case SELECT_SEARCH:
      return Object.assign({}, state, {
        query: action.query,
        totalItems: action.totalItems
      })
    case SEARCH_TOO_BROAD:
      return Object.assign({}, state, {
        tooManyResults: action.tooManyResults,
      })
    default:
      return state
  }
}

// Save any filters on the data (not used yet)
function filterSearch(state = '', action) {
  switch (action.type) {
    case FILTER_SEARCH:
      // return Object.assign({}, state, { query: action.query });
      // return action.filter;
      // let newState = action.filter;
      return state;
    default:
      return state
  }
}

// Make an array of just the currently viewed trials
function currentResults(state = {
  ids: [],
  trials: {},
  items: [],
  resultsReceived: false
}, action) {
  switch (action.type) {
    case GET_RESULTS:
      let itms = [], results = false;
      if (action.ids.length > 0) {
        itms = []
        action.ids.map(id => {
          return itms.push(action.trials[id])
        })
        results = true;
      }

      return Object.assign({}, state, {
        ids: action.ids,
        trials: {},
        items: itms,
        resultsReceived: results,
      })
  default:
    return state
  }
}



// Reordered the search results with normalizr so its more easily searchable
// --> an object of all trials (from all searches, non-duplicated) by id
function searchedTrials(state = {items: {}}, action) {
  switch (action.type) {
    case RECEIVE_SEARCH:
      // Merge the already searched trials with the old ones
      if (action.response && action.response.entities) {
        return merge({}, state, action.response.entities)
      } else {
        return state
      }

    default:
      return state
  }
}

// Save API response and response state
function mergeItems(state, action) {
  switch (action.type) {
    case RECEIVE_SEARCH:
      var newState = state.concat(action.items.result.items);
      return newState;

      // // Merge the already searched trials with the old ones
      // if (action.items.result.items) {
      //   return merge([], state, action.items.result.items)
      // } else {
      //   return state
      // }
    default:
      return state
  }
}

// Save API response and response state
function items(state = {
  isFetching: false,
  items: [],
  cumulativeSummary: {}
}, action) {

  switch (action.type) {
    case FINALIZE_SEARCH:
      return Object.assign({}, state, {
        isFetching: action.isFetching,
      })
    case REQUEST_SEARCH:
      return Object.assign({}, state, {
        isFetching: true,
      })
    case RECEIVE_SEARCH:
      return Object.assign({}, state, {
        // items: action.items.result.items,
        items: mergeItems(state.items, action),
        totalItems: action.totalItems,
        lastUpdated: action.receivedAt
      })
    case GET_CUMULATIVE_DATA:
      return Object.assign({}, state, {
        cumulativeSummary: action.cumulativeSummary
      })
    default:
      return state
  }
}

// Saves each search query and the ids of the trials returned
function searchHistory(state = {}, action) {
  switch (action.type) {
    case FINALIZE_SEARCH:
    case RECEIVE_SEARCH:
    case GET_CUMULATIVE_DATA:
    case REQUEST_SEARCH:
      return Object.assign({}, state, {
        [action.query]: items(state[action.query], action)
        // Same as:
        //   let nextState = {}
        //   nextState[action.query] = posts(state[action.query], action)
        //   return Object.assign({}, state, nextState)
      })
    default:
      return state
  }
}

const rootReducer = combineReducers({
  searchHistory,
  selectedQuery,
  searchedTrials,
  filterSearch,
  currentResults
})

// To reset all default states
const searchReducer = (state, action) => {
  if (action.type === CLEAR_STATE) {
    state = undefined
  }
  return rootReducer(state, action)
}

export default searchReducer
