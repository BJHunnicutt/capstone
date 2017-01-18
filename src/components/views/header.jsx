import React from 'react';
import { Link } from 'react-router';


export default (props) => {
  return (
    <header id="primary-header">

        <div className="top-bar" data-options="marginTop:0;" data-top-anchor="hero:bottom" >
          <div className="wrapper row">
            <div className="small-12 medium-6 large-6 columns">
              {/* Column 1 */}
                  <div className="top-bar-left">
                    <ul className="menu">
                      <li><Link to="/">Search</Link></li>
                      <li><Link to="/test">Comparisons</Link></li>
                      <li><Link to="/search">Relationships</Link></li>
                    </ul>
                  </div>
            </div>
            <div className="small-12 medium-6 large-6 columns">
              {/* Column 2 */}
                  <div className="top-bar-right">
                    <ul className="menu">
                      <li></li>
                      <li></li>
                    </ul>
                  </div>
            </div>
          </div>
        </div>

    </header>
  )
}
