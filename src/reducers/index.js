import { combineReducers } from 'redux';

// Reducers
import scatterReducer from './scatterReducer';
import searchReducer from './searchReducer';
// import searchLayoutReducer from './search-layout-reducer';

// Combine Reducers
var reducers = combineReducers({
    scatterState: scatterReducer,
    searchState: searchReducer,
    // searchLayoutState: searchLayoutReducer
});

export default reducers;
