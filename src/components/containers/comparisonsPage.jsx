import React from 'react';
import '../../styles/comparisons.css';
// import store from '../../store';
import { connect } from 'react-redux';
import ComparisonChart from '../views/comparisonChart.jsx'


const randomNum = () => Math.floor(Math.random() * 100);


class ComparisonsPage extends React.Component {
  constructor(props){
    console.log(props);
    super(); // "To get our context"
    this.state = {
      data: this.getData(),
    }
  }

  renderCharts(props) {
    // console.log('renderCharts num: ', props);
    return (props) => {
      // console.log('return num: ', props);
      const chartProps = {
        key: props.num
      };
      return <ComparisonChart {...chartProps} radius={props.radius}/>
    }
  }

  getData() {
    let dataArray = [{num: 1, radius: randomNum()},
      {num: 2, radius: randomNum()},
      {num: 3, radius: randomNum()}];
    return dataArray;
  }

  toggleData() {
    console.log('click');

    this.setState({
      data: this.getData(),
    });


  }

	render () {


  	return (

      <g>
        <div className='comparisons-wrapper row'>
          <div className="large-12 medium-12 small-12 columns">

            { this.state.data.map(this.renderCharts()) }

          </div>
        </div>
        <button className="button" onClick={this.toggleData.bind(this)}>Swap all the data!</button>

      </g>

    );
  }
}



// const renderCircles = (props) => {
//   return (coords, index) => { //coords are being passed as props below in .map(renderCircles(props))
//     const circleProps = {
//       cx: props.xScale(coords[0]),
//       cy: props.yScale(coords[1]),
//       r: 2,
//       key: index
//     };
//     return <Circle {...circleProps} />;
//   };
// };
//
// export default (props) => {
//   return <g>{ props.data.map(renderCircles(props)) }</g>
// }


const mapStateToProps = function(store) {
  return {
    query: store.searchState.selectedQuery.query,
    searchHistory: store.searchState.searchHistory,
    totalItems: store.searchState.currentResults,
    data: store.scatterState.dataBar,

  };
}
export default connect(mapStateToProps)(ComparisonsPage);
