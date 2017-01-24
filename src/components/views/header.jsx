import React from 'react';
import { Link } from 'react-router';


export default (props) => {
  return (
    <header id="primary-header">

        <div className="top-bar" data-options="marginTop:0;" data-top-anchor="hero:bottom" >
          <div className="wrapper row">
            <div className="small-3 medium-3 large-3 columns">
              {/* Column 2 */}
                  <div className="top-bar-left">
                    <h3><Link to="/capstone/">TrialsViewer</Link></h3>
                  </div>
            </div>
            <div className="small-8 medium-6 large-6 columns">
              {/* Column 1 */}
                  <div className="top-bar-right">
                    <ul className="menu">
                      <li><Link to="/capstone/search">Search</Link></li>
                      <li><Link to="/capstone/comparisons">Comparisons</Link></li>
                      <li><Link to="/capstone/relationships">Relationships</Link></li>
                    </ul>
                  </div>
            </div>
          </div>
        </div>
        <hr/>
        <hr/>

    </header>
  )
}
