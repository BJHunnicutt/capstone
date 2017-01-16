import { combineReducers } from 'redux'
import {
  SELECT_SEARCH, INVALIDATE_SEARCH, REQUEST_SEARCH, RECEIVE_SEARCH
} from '../actions/actionTypes'



function selectedQuery(state = '', action) {
  switch (action.type) {
    case SELECT_SEARCH:
      // return Object.assign({}, state, { query: action.query });
      return action.query;
    default:
      return state
  }
}

function trials(state = {
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
        items: action.items,
        totalItems: action.totalItems,
        lastUpdated: action.receivedAt
      })
    default:
      return state
  }
}

function trialsBySearch(state = {}, action) {
  switch (action.type) {
    case INVALIDATE_SEARCH:
    case RECEIVE_SEARCH:
    case REQUEST_SEARCH:
      return Object.assign({}, state, {
        [action.query]: trials(state[action.query], action)
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
  trialsBySearch,
  selectedQuery
})

export default searchReducer
