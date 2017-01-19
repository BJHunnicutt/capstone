import React from 'react';
// import d3 from 'd3';
import Header from '../views/header.jsx';
// import SearchPage from '../components/search_page.jsx';

import store from '../../store'; //Just to log the store



// CLASS COMPONENT
class App extends React.Component {

  showReduxStore() {
    console.log("Current store: ", store.getState());
  }

  render(){
    return (
      <div>

        {/* Render the header */}
        <Header />

        {/* Render the plot */}
        <div className='row' id="content" >
          {this.props.children}
        </div>

        <button className='button redux-store' onClick={this.showReduxStore.bind(this)}>Log Redux Store</button>


      </div>
    )
  }
} // closing App class

export default App;
