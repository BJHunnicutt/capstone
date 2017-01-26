import store from '../store';

// Reset to defaults
export const CLEAR_STATE = 'CLEAR_STATE'

// Scatter Actions
export const GET_DATA_SCATTER = 'GET_DATA_SCATTER';
export const GET_DATA_BAR = 'GET_DATA_BAR';
export const SEARCH_DATA_GENDER = 'SEARCH_DATA_GENDER';
export const SHOW_PUBLICATIONS = 'SHOW_PUBLICATIONS'
export const GET_CUMULATIVE_DATA = 'GET_CUMULATIVE_DATA'
export const GET_RELATIONSHIP_DATA = 'GET_RELATIONSHIP_DATA'

// export function getDataScatter(data) {
//   return {
//     type: GET_DATA_SCATTER,
//     data
//   };
// }



// SEARCH Actions
export const SELECT_SEARCH = 'SELECT_SEARCH';
export const REQUEST_SEARCH = 'REQUEST_SEARCH';
export const RECEIVE_SEARCH = 'RECEIVE_SEARCH';
export const FILTER_SEARCH = 'FILTER_SEARCH';
export const FINALIZE_SEARCH = 'FINALIZE_SEARCH';
export const GET_RESULTS = 'GET_RESULTS';
export const FAILED_SEARCH = 'FAILED_SEARCH';
export const SEARCH_TOO_BROAD = 'SEARCH_TOO_BROAD'
// export function selectSearch(query) {
//   return {
//     type: SELECT_SEARCH,
//     query
//   }
// }
//
// export function invalidateSearch(query) {
//   return {
//     type: INVALIDATE_SEARCH,
//     query
//   }
// }
//
// export function requestSearch(query) {
//   return {
//     type: REQUEST_SEARCH,
//     query
//   }
// }
//
// function receiveSearch(query, json) {
//   return {
//     type: RECEIVE_SEARCH,
//     query,
//     trials: json.data.children.map(child => child.data),
//     receivedAt: Date.now()
//   }
// }
//
export function filterSearch(filter) {
  return {
    type: FILTER_SEARCH,
    filter
  }
}

export function getSearchResults(filter) {
  return {
    type: GET_RESULTS,
    ids: store.getState().searchState.searchHistory[store.getState().searchState.selectedQuery].items,
    trials: store.getState().searchState.searchedTrials.items
  }
}
