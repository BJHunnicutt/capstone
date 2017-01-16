import { combineReducers } from 'redux';

// Reducers
import scatterReducer from './scatterReducer';
// import widgetReducer from './widget-reducer';
// import searchLayoutReducer from './search-layout-reducer';

// Combine Reducers
var reducers = combineReducers({
    scatterState: scatterReducer,
    // widgetState: widgetReducer,
    // searchLayoutState: searchLayoutReducer
});

export default reducers;
