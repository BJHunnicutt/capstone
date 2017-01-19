import React from 'react';
// import d3 from 'd3';
// import '../../styles/App.css';
import SearchInput from '../views/searchBar.jsx';
import SearchPageView from '../views/searchPageView.jsx';

// Adding in redux
import { connect } from 'react-redux';
import store from '../../store';
import { RECEIVE_SEARCH, REQUEST_SEARCH, FILTER_SEARCH, SELECT_SEARCH, GET_RESULTS, GET_DATA_SCATTER } from '../../actions/actions'; //FAILED_SEARCH,
import { normalize, schema } from 'normalizr'


// The number of data points for the chart.
const numDataPoints = 50;
// A function that returns a random number from 0 to 1000
const randomNum     = () => Math.floor(Math.random() * 1000);
// A function that creates an array of 50 elements of (x, y) coordinates.
const randomDataSet = () => {
  return Array.apply(null, {length: numDataPoints}).map(() => [randomNum(), randomNum()]);
}

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
        // Save the response
        store.dispatch({
          type: RECEIVE_SEARCH,
          query: query,
          response: this.normalizeQuery(response), // The reordered json response
          items: this.normalizeQuery(response), // An array of the trial IDs
          totalItems: response.total_count,
          receivedAt: Date.now()
        })
        // Save the search (helps with accessing the searchHistory store)
        store.dispatch({
          type: SELECT_SEARCH,
          query: query,
        })
        // Save a formatted version of the most recent search
        let ids = store.getState().searchState.searchHistory[store.getState().searchState.selectedQuery].items;
        let trials = store.getState().searchState.searchedTrials.items;
        store.dispatch({
          type: GET_RESULTS,
          ids: ids,
          trials: trials
        })
        //
        store.dispatch({
          type: GET_DATA_SCATTER,
          data: randomDataSet(),
        })
        // Catch errors (kind of, the errors still log to the console, but it keeps working)
      })
      // .catch(error => {
      //   console.log(error, "error... write an action for the dispatch later");
      //   store.dispatch({
      //     type: FAILED_SEARCH,
      //     error: error
      //   })
      // });
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

    store.dispatch({
      type: FILTER_SEARCH,
      filter: event.target.value
    });
  }


  getSearchResults() {
    let currentTrials =  [];
    if (store.getState().searchState.selectedQuery !== '') {
      let searchTerm = store.getState().searchState.selectedQuery;
      let currentTrialIDs = store.getState().searchState.searchHistory[searchTerm].items;
      currentTrials = currentTrialIDs.map(id => {
        return store.getState().searchState.searchedTrials.items[id]
      })
    }
    return currentTrials
  }

  render(){
    // TO DISPLAY FILTERED SEARCH RESULTS -- DEV ONLY (in return)
    // let items = this.state.items;
    // let totalItems = this.state.totalItems;
    // if(this.state.filter ) {
    //   items = items.filter( item =>
    //     item.public_title.toLowerCase()
    //     .includes(this.state.filter.toLowerCase()))
    // }

    var cyan = {
      'backgroundColor': 'cyan'
    };

    return (
      <div className="search_page">
        <div className="row">
          <div className="large-6 large-centered columns">

              {/* SEARCH */}
              <label>Search by Treatment or Condition</label>
              <SearchInput  // Custom component - Search bar
                ref={component => this.globalSearch = component} // THis can also take a callback (here we're setting as the nested class component Input)
                update={this.update.bind(this)} // update now, not on change
              />


              {/* FILTER SEARCH RESULTS */}
              <label>Filter Search Results</label>
              <input type="text"
              onChange={this.filter.bind(this)} />
          </div>
        </div>
        <hr/>

        <div className="row search-result" >

          <div className="large-6 medium-6 small-12 columns">
              {/* Corresponding View Component */}
              <SearchPageView {...this.props} />
          </div>

          <div className="large-6 medium-6 small-12 columns">
              {/* Render the plot */}
              <div className="nested-plot">
                {this.props.children}
              </div>
          </div>
        </div>


        {/* DISPLAY FILTERED SEARCH RESULTS -- DEV ONLY */}
        {/* <h5>{totalItems}</h5>
          {items.map(item =>
          // The elements in an array (i.e. amongst siblings) should have a unique key prop --> using the public_title below
          <div key={item.id}>
            <h4> {item.public_title} </h4>
          </div>
        )}
        <p>{JSON.stringify(store.getState().searchState.searchedTrials.items)}</p> */}

      </div>
    )
  }
} // closing Class

// SearchPage.defaultProps = {
//   val: 0
// }

// export default SearchPage;


const mapStateToProps = function(store) {
  return {
    query: store.searchState.selectedQuery,
    items: store.searchState.searchedTrials.items,
    searchHistory: store.searchState.searchHistory,
    totalItems: store.searchState.currentResults,
    // receivedAt: store.searchState.receivedAt
  };
}

export default connect(mapStateToProps)(SearchPage);
