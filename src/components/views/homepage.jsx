import React from 'react';
// import store from '../../store';
import { connect } from 'react-redux';
import '../../styles/relationships.css';

// import SearchPage from '../containers/searchPage.jsx'


class Homepage extends React.Component {
	constructor(props){
    super(); // "To get our context"
    this.state = {
    }
  }


	render () {


  	return (
      <div>
				<div className="column large-10 large-centered medium-10 medium-centered small-12">
					<h2 className="f2 homepage-title">TrialsViewer<small className="f2">: Clinical Trial Explorer</small></h2>
	        <h5 className="f2" id="quote">You can observe a lot by just watching <small>-Yogi Berra</small></h5>

	        <p>
	          Clinical trials are a necessary and important tool used to test whether new drugs and
						procedures are safe and effective. Since 2007, new trials have been <a href="https://www.gpo.gov/fdsys/pkg/PLAW-110publ85/pdf/PLAW-110publ85.pdf#page=82" target="_blank"></a>
						required to register their intent and methods with the FDA, but this data has historically been difficult to access.
						The <a href="http://opentrials.net/" target="_blank"><strong>OpenTrials project</strong></a> is trying to
						change that by making registered trial data from around the world easily available to the public.
					</p>
					<p>
						<strong>TrialsViewer</strong> is an independently created tool to explore the data available through
						the OpenTrials API. The goal is to create a summary that allows you to compare drugs or procedures for
						a given condition by highlighting two components:
					</p>
					<ul>
						<li>
							1. <strong>Gender</strong>: Drugs regularly get approved without being tested on women, an "oversight"
							that can have life changing consequences. <a href="https://www.drugwatch.com/featured/fda-let-women-down/" target="_blank">
							It has been estimated that 8 out of 10 drugs pulled from the market by the FDA posed more of a threat for women.</a>
						</li>
						<li>
							2. <strong>Publication Rates</strong>: Trials with negative results are twice as likely to remain unreported as those with positive results,
							leading to <a href="http://www.nejm.org/doi/full/10.1056/NEJMsa065779#t=article" target="_blank"> a misrepresentation of treatment efficacy.</a>
						</li>
					</ul>
			</div>
			<h3 className="f2 homepage-text "> Try it out! </h3>

			<div className="homepage-search">
        {/* SearchBar - i.e. containers/searchPage.jsx */}
        {this.props.children}
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
