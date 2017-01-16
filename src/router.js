import React from 'react';
import { Router, Route, browserHistory, NoMatch, IndexRoute } from 'react-router';

// Layouts
import App from './containers/App.js';

// Pages
import Scatter from './containers/Scatter.jsx'
import SearchPage from './components/searchPage.jsx'


// Nested Routes
export default (
  // *don't use history={hashHistory}, browser history manages the url better
  <Router history={browserHistory} >
    {/* <IndexRoute component={App} /> */}
    <Route component={App}>
      <Route path="/" component={SearchPage}>
        <IndexRoute component={Scatter} />
      </Route>


      <Route path="search" component={SearchPage} />
      <Route path="test" component={Scatter} />
    </Route>
    {/* This catch-all route will match everything, it must be the last route specified in the child route array. */}
    <Route path="*" component={NoMatch}/>
  </Router>
);
