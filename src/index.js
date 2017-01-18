import React from 'react';
import ReactDOM from 'react-dom';
import router from './router';
// Styles
import './styles/index.css';
import './styles/foundation.css';
import './styles/fixed-data-table.css';

// REDUX
import { Provider } from 'react-redux';
import store from './store';


// Imported Routes
    // -- Provider is a top-level component that wraps our entire application,
    // including the Router. We pass it a reference to the store so we can use
    // react-redux's connect() method for Component Containers.
ReactDOM.render(
  <Provider store={store}>{router}</Provider>,
  document.getElementById('root')
);


// // No Routes
// ReactDOM.render(
//   <App />,
//   document.getElementById('root')
// );


// // Separate Routes
// ReactDOM.render((
//   <Router history={browserHistory} >
//     <Route path="/" component={App} />
//     <Route path="/test" component={Test} />
//   </Router>
// ), document.getElementById('root'));

// Nested Routes
// ReactDOM.render((
//   // *don't use history={hashHistory}, browser history manages the url better
//   <Router history={browserHistory} >
//     {/* <IndexRoute component={App} /> */}
//     <Route component={App}>
//       <Route path="/" component={SearchPage}>
//         <IndexRoute component={Scatter} />
//       </Route>
//
//
//       <Route path="search" component={SearchPage} />
//       <Route path="test" component={Scatter} />
//     </Route>
//     {/* This catch-all route will match everything, it must be the last route specified in the child route array. */}
//     <Route path="*" component={NoMatch}/>
//   </Router>
// ), document.getElementById('root'));
