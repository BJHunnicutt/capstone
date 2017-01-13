import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import './styles/foundation.css';
import App from './app/App.js';
import Test from './page-two/test/Test.jsx'
// import { Router, Route, Link, browserHistory, IndexRoute  } from 'react-router';
import { NoMatch, Router, Route, browserHistory } from 'react-router';


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
ReactDOM.render((
  <Router history={browserHistory} >
    {/* <IndexRoute component={App} /> */}
    <Route path="/" component={App}>
      <Route path="test" component={Test} />
    </Route>
    <Route path="*" component={NoMatch}/> {/* This catch-all route will match everything, it must be the last route specified in the child route array. */}
  </Router>
), document.getElementById('root'));
