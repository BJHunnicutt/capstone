import React from 'react';
import { Link } from 'react-router';


export default (props) => {
  return (
    <div>
      <hr/>
      <footer id="primary-footer">
          <div className="large-12 centered column">
            <h3 className="f3">
              <Link to="/">TrialsViewer</Link>
            </h3>
          </div>
          <div className="wrapper row">
            <div className="small-12 medium-12 large-12 centered columns">
              <ul className="links">
                <li>
                  <strong> * IMPORTANT NOTE: </strong>
                </li>
                <li>
                  The OpenTrialsFDA API is only in its beta release, thus <i><strong>clinical trial data are currently incomplete</strong></i> on the 'Search' and 'Compare' pages. Check back or follow <a href="https://twitter.com/opentrials">@OpenTrials</a> for updates!
                </li>
                <hr/>
                <li>
                  Data Sources: <a href="https://fda.opentrials.net/search">OpenTrialsFDA</a> & <a href="https://github.com/ebmdatalab/trialstracker">TrialsTracker</a>
                </li>
                <li>
                  Design Inspiration: <a href="http://www.patentsview.org/web/#viz/relationships">PatentsView</a>
                </li>
                <li>
                  Site Created by Jeannie Hunnicutt &copy; 2017
                  <div className="social-links">
                    {/* <a href="https://www.linkedin.com/in/jeanniehunnicutt/"><i className="fa fa-linkedin fa-lg"/></a> */}
                    <a href="https://github.com/BJHunnicutt"><i className="fa fa-github fa-lg"/></a>
                    <a href="mailto:jeannie.hunnicutt@gmail.com"><i className="fa fa-envelope-o fa-lg"/></a>
                    <a href="https://github.com/BJHunnicutt/capstone"><i className="fa fa-code fa-lg"/></a>
                  </div>
                </li>
              </ul>
            </div>
          </div>
      </footer>
    </div>
  )
}
