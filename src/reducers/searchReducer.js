import { combineReducers } from 'redux'
import {
  SELECT_SEARCH, INVALIDATE_SEARCH, REQUEST_SEARCH, RECEIVE_SEARCH, FILTER_SEARCH, GET_RESULTS
} from '../actions/actions'

import merge from 'lodash/merge'


// Save the last search (may change to current viewed)
function selectedQuery(state = '', action) {
  switch (action.type) {
    case SELECT_SEARCH:
      let newState = action.query
      // return Object.assign({}, state, { query: action.query });
      return newState;
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
      if (action.ids.length > 0) {
        var itms = []
        action.ids.map(id => {
          return itms.push(action.trials[id])
        })
      }

      return Object.assign({}, state, {
        ids: action.ids,
        trials: {},
        items: itms,
        resultsReceived: true
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
function items(state = {
  isFetching: false,
  didInvalidate: false,
  items: []
}, action) {

  switch (action.type) {
    case INVALIDATE_SEARCH:
      return Object.assign({}, state, {
        didInvalidate: true
      })
    case REQUEST_SEARCH:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      })
    case RECEIVE_SEARCH:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        items: action.items.result.items,
        totalItems: action.totalItems,
        lastUpdated: action.receivedAt
      })
    default:
      return state
  }
}

// Saves each search query and the ids of the trials returned
function searchHistory(state = {}, action) {
  switch (action.type) {
    case INVALIDATE_SEARCH:
    case RECEIVE_SEARCH:
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

const searchReducer = combineReducers({
  searchHistory,
  selectedQuery,
  searchedTrials,
  filterSearch,
  currentResults
})

export default searchReducer
