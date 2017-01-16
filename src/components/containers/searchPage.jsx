import React from 'react';
// import d3 from 'd3';
// import '../../styles/App.css';
import SearchInput from '../views/searchBar.jsx';
// Adding in redux
import { connect } from 'react-redux';
import store from '../../store';
import { RECEIVE_SEARCH, REQUEST_SEARCH } from '../../actions/actions';
import { normalize, schema } from 'normalizr'


// CLASS COMPONENT
class SearchPage extends React.Component {
  constructor(){
    super(); // "To get our context"
    this.state = {
      items: [],
      totalItems: 0,
      globalSearch: 'Search By Treatment'
    }
  }

  update(event){
    // console.log(event.target)
    this.setState({
      globalSearch: this.globalSearch.refs.input.value,
    });
    // if (event.target == )
    this.updateSearch();
  }

  normalizeQuery(response) {
    // THis is reformatting the response so it is easier to search
      // - also allows multiple searches to be stored without duplicate trials
    let myData = response;
    let item = new schema.Entity('items');
    let mySchema = { items: [ item ] }
    let normalizedData = normalize(myData, mySchema);
    return normalizedData
  }

  updateSearch(event){
    let query = this.globalSearch.refs.input.value;
    store.dispatch({
      type: REQUEST_SEARCH,
      query: query
    });

    fetch('https://api.opentrials.net/v1/search?q=interventions.name%3A(' +
            this.globalSearch.refs.input.value + ')%20OR%20public_title%3A(' +
            this.globalSearch.refs.input.value + ')%20OR%20conditions.name%3A(' +
            this.globalSearch.refs.input.value + ')&per_page=100')
      .then( response => response.json())
      // .then(json => store.dispatch({
      //   type: RECEIVE_SEARCH,
      //   query: query,
      //   items: json.data.children.map(child => child.data),
      //   // totalItems: response.total_count,
      //   receivedAt: Date.now()
      // }))
      .then( (response) => {
        this.setState({items: response.items})
        this.setState({totalItems: response.total_count})
        store.dispatch({
          type: RECEIVE_SEARCH,
          query: query,
          response: this.normalizeQuery(response), // The reordered json response
          items: this.normalizeQuery(response), // An array of the trial IDs
          totalItems: response.total_count,
          receivedAt: Date.now()
        })

      })
      // .then((response) => store.dispatch({
      //   type: RECEIVE_SEARCH,
      //   items: response.items,
      // }))
  }

  getLocations(){
    // let data = {
    //   gender: '',
    //   targetSampleSize: '',
    //   status: '',
    //   registrationDate: '',
    //   completionDate: '',
    //   publishedResults: '',
    //   locations: [],
    //   recruitmentStatus: '',
    //   organisations: '',
    //   url: '',
    //   sources: [],
    // }
    // console.log(data);
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

  showReduxStore() {
    console.log("Current store: ", store.getState());
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

    // console.log("Current state: ", store.getState());

    return (
      <div className="search_page">

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


        {/* Render the plot */}
        <div className="nested-plot">
          {this.props.children}
        </div>


        {/* DISPLAY FILTERED SEARCH RESULTS -- DEV ONLY */}
        <h5>{totalItems}</h5>
        <button className='button' onClick={this.showReduxStore}>Log Redux Store</button>

        {items.map(item =>
          // The elements in an array (i.e. amongst siblings) should have a unique key prop --> using the public_title below
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
        <p>{JSON.stringify(items)}</p>

      </div>
    )
  }
} // closing SearchPage class

const Title = (props) => <h4> {props.title.public_title} </h4>

SearchPage.defaultProps = {
  val: 0
}

// export default SearchPage;


const mapStateToProps = function(store) {
  return {
    query: store.searchState.query,
    items: store.searchState.items,
    // trials: store.searchState.trials,
    totalItems: store.searchState.totalItems,
    receivedAt: store.searchState.receivedAt
  };
}

export default connect(mapStateToProps)(SearchPage);
