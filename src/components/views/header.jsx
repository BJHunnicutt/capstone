import React from 'react';
import { Link } from 'react-router';


export default (props) => {
  return (
    <header id="primary-header">

        <div className="top-bar" data-options="marginTop:0;" data-top-anchor="hero:bottom" >
          <div className="wrapper row">
            <div className="small-6 medium-3 large-3 columns">
              {/* Column 2 */}
                  <div className="top-bar-left">
                    <h3 className="f3">
                      <Link to="/" className="other-header">TrialsViewer</Link>
                      <Link to="/" className="tiny-header">Trials Viewer</Link>
                    </h3>
                  </div>
            </div>
            <div className="small-6 medium-9 large-9 columns">
              {/* Column 1 */}
                  <div className="top-bar-right">
                    <ul className="menu">
                      <li>
                        <Link to="/search" className="large-header" title="Search">
                          <i className="material-icons"> search </i>
                          Search
                          <i className="material-icons small-header"> search </i>
                        </Link>
                        <Link to="/search" className="medium-header" title="Search">
                          <i className="material-icons "> search </i>
                          Search
                        </Link>
                        <Link to="/search" className="small-header" title="Search">
                          <i className="material-icons "> search </i>
                        </Link>
                      </li>
                      <li>
                        <Link to="/comparisons" className="large-header" title="Comparisons">
                          <i className="material-icons"> multiline_chart </i>
                          Compare Trials
                        </Link>
                        <Link to="/comparisons" className="medium-header" title="Comparisons">
                          <i className="material-icons"> multiline_chart </i>
                          Compare
                        </Link>
                        <Link to="/comparisons" className="small-header" title="Comparisons">
                          <i className="material-icons"> multiline_chart </i>
                        </Link>
                      </li>
                      <li>
                        <Link to="/relationships" className="large-header" title="Explore Relationships">
                        <i className="material-icons"> linear_scale </i>
                          Explore Relationships
                        </Link>
                        <Link to="/relationships" className="medium-header" title="Explore Relationships">
                        <i className="material-icons"> linear_scale </i>
                          Explore
                        </Link>
                        <Link to="/relationships" className="small-header" title="Explore Relationships">
                        <i className="material-icons"> linear_scale </i>
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
