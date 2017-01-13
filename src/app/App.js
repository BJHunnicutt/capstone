import React from 'react';
import { Link } from 'react-router';

// import d3 from 'd3';
import '../styles/App.css';


// CLASS COMPONENT
class App extends React.Component {
  constructor(){
    super(); // "To get our context"
    this.state = {
      items: [],
      totalItems: 0,
      globalSearch: 'Search By Treatment'
    }
  }

  update(event){
    console.log(event.target)
    this.setState({
      globalSearch: this.globalSearch.refs.input.value,
    });
    this.updateSearch();
  }

  updateSearch(event){
    fetch('https://api.opentrials.net/v1/search?q=interventions.name%3A(' +
            this.globalSearch.refs.input.value + ')%20OR%20public_title%3A(' +
            this.globalSearch.refs.input.value + ')%20OR%20conditions.name%3A(' +
            this.globalSearch.refs.input.value + ')&per_page=50')
      .then( response => response.json())
      .then( (response) => {
        this.setState({items: response.items})
        this.setState({totalItems: response.total_count})
      })
  }

  getLocations(){
    let data = {
      gender: '',
      targetSampleSize: '',
      status: '',
      registrationDate: '',
      completionDate: '',
      publishedResults: '',
      locations: [],
      recruitmentStatus: '',
      organisations: '',
      url: '',
      sources: [],
    }
    console.log(data);
  }

  getGenders(){

  }



  componentDidUpdate(){
    // Getting an API Query
    // fetch('http://swapi.co/api/people/?format=json')

  }


  filter(event){
    this.setState({filter: event.target.value}) // event.target.value is the result of an input field (in render below)
  }

  render(){
    let items = this.state.items
    let totalItems = this.state.totalItems
    // console.log(items[0].sources.name === );
    // Object.keys(items.sources)[0]

    // Filtering the API results
    if(this.state.filter) {
      items = items.filter( item =>
        item.public_title.toLowerCase()
        .includes(this.state.filter.toLowerCase()))
    }

    return (
      <div className="app">
        <header className="primary-header">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/test">Test Plot</Link></li>
            <li><Link to="/nowhere">No Where</Link></li>
          </ul>
        </header>


        {/* SEARCH */}
        <label>{this.state.globalSearch}</label>
        <SearchInput  // Custom component - Search bar
          ref={component => this.globalSearch = component} // THis can also take a callback (here we're setting as the nested class component Input)
          update={this.update.bind(this)} // update now, not on change
        />

        {/* FILTER SEARCH RESULTS */}
        <label>Filter Search Results</label>
        <input type="text"
        onChange={this.filter.bind(this)} />


        <div className="nested-plot">
          {this.props.children}
        </div>

        {/* DISPLAY FILTERED SEARCH RESULTS */}
        <h5>{totalItems}</h5>
        {items.map(item =>
          // the elements in an array (i.e. amongst siblings) should have a unique key prop --> using the public_title below
          <div key={item.id}>
            <Title key={item.public_title} title={item} />
            <p>{JSON.stringify(item.sources)}</p>
            <p>
              {Object.keys(item.sources).map(source =>
                source + " "
              )}
            </p>
          </div>
        )}
        <p>{JSON.stringify(items)} gh-pages</p>
      </div>
    )
  }
} // closing App class

const Title = (props) => <h4> {props.title.public_title} </h4>

class SearchInput extends React.Component {
  render(){
    return (
      <span>
        <input ref="input" type="text"/>
        <button className='button' onClick={this.props.update}>search</button>
      </span>
    )
  }
}

App.defaultProps = {
  val: 0
}

export default App;
