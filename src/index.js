import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import './styles/foundation.css';
import App from './containers/App.js';
import Scatter from './containers/Scatter.jsx'
import SearchPage from './components/searchPage.jsx'
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
  // *don't use history={hashHistory}, browser history manages the url better
  <Router history={browserHistory} >
    {/* <IndexRoute component={App} /> */}
    <Route component={App}>
      <Route component={SearchPage}>
        <Route path="/" component={Scatter} />
      </Route>


      <Route path="search" component={SearchPage} />
      <Route path="test" component={Scatter} />
    </Route>
    {/* This catch-all route will match everything, it must be the last route specified in the child route array. */}
    <Route path="*" component={NoMatch}/>
  </Router>
), document.getElementById('root'));
