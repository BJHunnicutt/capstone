
// Scatter Actions
export const GET_DATA_SCATTER = 'GET_DATA_SCATTER';

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
export const INVALIDATE_SEARCH = 'INVALIDATE_SEARCH';


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
// export function filterSearch(filter) {
//   return {
//     type: FILTER_SEARCH,
//     filter
//   }
// }
