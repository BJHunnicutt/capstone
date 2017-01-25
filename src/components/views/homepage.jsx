import React from 'react';
// import store from '../../store';
import { connect } from 'react-redux';
import '../../styles/relationships.css';
import d3 from 'd3'
import allData from '../data/test.csv'

import SearchPage from '../containers/searchPage.jsx'


class Homepage extends React.Component {
	constructor(props){
    super(); // "To get our context"
    this.state = {
    }
  }


	render () {


  	return (
      <div>
        <h4 className="f2">You can observe a lot by just watching <small>-Yogi Berra</small></h4>

        <p>
          Why it matters Clinical trials are the best way we have of testing whether
          a medicine is safe and effective. They can involve thousands of people, patients
          and healthy volunteers, and take years to complete. But trials with negative
          results are twice as likely to remain unreported as those with positive results.
          This means that patients and doctors don't have the full information about the
          benefits and risks of treatments. We believe all clinical trials, past and
          present, should be reported in full. Read more on AllTrials.net and sign the
          petition.
        </p>

        <div className="row search-result" >
          <div className="large-10 large-centered columns">
            {/* SearchBar - i.e. containers/searchPage.jsx */}
            {this.props.children}
          </div>
        </div>

      </div>
    );
  }
}



const mapStateToProps = function(store) {
  return {

  };
}
export default connect(mapStateToProps)(Homepage);



// You can observe a lot by just watching
