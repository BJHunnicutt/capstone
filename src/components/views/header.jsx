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
                    <h3><Link to="/">TrialsViewer</Link></h3>
                  </div>
            </div>
            <div className="small-8 medium-8 large-8 columns">
              {/* Column 1 */}
                  <div className="top-bar-right">
                    <ul className="menu">
                      <li>
                        <Link to="/search">
                          <i className="material-icons"> search </i>
                          Search
                        </Link>
                      </li>
                      <li>
                        <Link to="/comparisons">
                          <i className="material-icons"> multiline_chart </i>
                          Compare Trials
                        </Link>
                      </li>
                      <li>
                        <Link to="/relationships">
                          <i className="material-icons"> linear_scale </i>
                          Explore Relationships
                        </Link>
                      </li>
                      {/* <li><Link to="/capstone/comparisons"><i className="material-icons">multiline_chart</i>Comparisons</Link></li>
                      <li><Link to="/capstone/relationships"><i className="material-icons"><i class="material-icons">linear_scale</i></i>Relationships</Link></li> */}
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
