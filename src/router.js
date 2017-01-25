import React from 'react';
import { Router, Route, browserHistory, NoMatch, IndexRoute } from 'react-router';

// Layouts
import App from './App.js';

// Pages
import Scatter from './components/views/Scatter.jsx'
import SearchPage from './components/containers/searchPage.jsx'
import ComparisonsPage from './components/containers/comparisonsPage.jsx'
import RelationshipsPage from './components/containers/relationshipsPage.jsx'
import Homepage from './components/views/homepage.jsx'

// Nested Routes
export default (
  // *don't use history={hashHistory}, browser history manages the url better
  <Router history={browserHistory} >
    {/* <IndexRoute component={App} /> */}
    <Route component={App}>
      <Route path="/" component={Homepage}>
        <IndexRoute component={SearchPage} />
      </Route>

      <Route path="/search" component={SearchPage}>
        <IndexRoute component={Scatter} />
      </Route>

      <Route path="/comparisons" component={SearchPage}>
        <IndexRoute component={ComparisonsPage} />
      </Route>


      {/* <Route path="capstone/comparisons" component={ComparisonsPage} /> */}

      <Route path="/relationships" component={RelationshipsPage} />
    </Route>
    {/* This catch-all route will match everything, it must be the last route specified in the child route array. */}
    <Route path="*" component={NoMatch}/>
  </Router>
);
