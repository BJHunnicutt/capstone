import React from 'react';
import { Router, Route, browserHistory, NoMatch, IndexRoute } from 'react-router';

// Layouts
import App from './App.js';

// Pages
import Scatter from './components/views/Scatter.jsx'
import SearchPage from './components/containers/searchPage.jsx'


// Nested Routes
export default (
  // *don't use history={hashHistory}, browser history manages the url better
  <Router history={browserHistory} >
    {/* <IndexRoute component={App} /> */}
    <Route component={App}>
      <Route path="capstone" component={SearchPage}>
        <IndexRoute component={Scatter} />
      </Route>


      <Route path="capstone/search" component={SearchPage} />
      <Route path="capstone/test" component={Scatter} />
    </Route>
    {/* This catch-all route will match everything, it must be the last route specified in the child route array. */}
    <Route path="*" component={NoMatch}/>
  </Router>
);
