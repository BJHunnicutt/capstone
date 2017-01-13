import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import './styles/foundation.css';
import App from './app/App.js';
import Test from './page-two/test/Test.jsx'
// import { Router, Route, Link, browserHistory, IndexRoute  } from 'react-router';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';


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
  </Router>
), document.getElementById('root'));
