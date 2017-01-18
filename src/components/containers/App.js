import React from 'react';
// import d3 from 'd3';
import '../../styles/App.css';
import Header from '../views/header.jsx';
// import SearchPage from '../components/search_page.jsx';



// CLASS COMPONENT
class App extends React.Component {
  // constructor(){
  //   super(); // "To get our context"
  //   this.state = {
  //
  //   }
  // }
  //
  // update(event){
  //
  // }

  render(){
    return (
      <div>
        {/* Render the header */}
        <Header />

        {/* Render the plot */}
        <div id="content">
          {this.props.children}
        </div>

      </div>
    )
  }
} // closing App class

export default App;
