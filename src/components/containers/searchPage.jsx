import React from 'react';
// import d3 from 'd3';
// import '../../styles/App.css';
import SearchInput from '../views/searchBar.jsx';
import SearchPageView from '../views/searchPageView.jsx';
import RecentSearches from '../views/recentSearches.jsx'
import $ from 'jquery'
import _ from 'lodash'

// Adding in redux
import { connect } from 'react-redux';
import store from '../../store';
import { RECEIVE_SEARCH, REQUEST_SEARCH, FILTER_SEARCH, SELECT_SEARCH, GET_RESULTS, GET_DATA_SCATTER, GET_DATA_BAR, SEARCH_TOO_BROAD, FINALIZE_SEARCH } from '../../actions/actions'; //FAILED_SEARCH,
import { normalize, schema } from 'normalizr';

const maxItems = 1000;

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
    // Clean up Query
    let query = this.globalSearch.refs.input.value;

    let cleanQuery = query.replace(/[^a-zA-Z ]/g, "");  //Remove everything except letters
    let validQuery = cleanQuery !== '';
    // console.log('cleanQuery: ',cleanQuery);
    // console.log('valid: ', validQuery);

    if (validQuery) {
      this.setState({
        globalSearch: cleanQuery,
      });
      this.updateSearch(cleanQuery);

    } else {
      console.log("Invalid Search, please enter a treatment or condition");
    }

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

  updateSearch(query = null, page = 1, callback = false){

    // Keep fetching until the total items in the search are accessed (100 at a time limit)
    if (store.getState().searchState.selectedQuery.query === query) { // Query will only not equal null if this is a callback from fetchSearch()
      let itemsInSearch = store.getState().searchState.searchHistory[store.getState().searchState.selectedQuery.query].totalItems;
      let itemsAcquired = store.getState().searchState.searchHistory[store.getState().searchState.selectedQuery.query].items.length;

      console.log('itemsInSearch: ', itemsInSearch);
      console.log('itemsAcquired: ', itemsAcquired);


      // If there are more items to get from the API for this search
      if (itemsInSearch > itemsAcquired) {

        // If the search returns more than maxResults (defined at the top of this file)
        if (store.getState().searchState.selectedQuery.tooManyResults && (page === maxItems/100)) {
          console.log('too many results, the most recent 1000 are shown');
          this.finalizeSearchResults(query);
          return null;

        } else {
          page += 1; // Get the next page of API requests
          this.fetchSearch(page, query);
        }

      // If all items are received, dispatch an action to say so
      } else { // Stop if all items are received, and dispatch an action to say so
        this.finalizeSearchResults(query);
        return null;
      }

    } else { // Fetch the search (this happens on the first call)
      this.fetchSearch(page, query);
    }


  }

  finalizeSearchResults(query){
    // Save a formatted version of the most recent search
    let ids = store.getState().searchState.searchHistory[store.getState().searchState.selectedQuery.query].items;
    let trials = store.getState().searchState.searchedTrials.items;
    store.dispatch({
      type: FINALIZE_SEARCH,
      query: query,
      isFetching: false,
    });
    store.dispatch({
      type: GET_RESULTS,
      query: query,
      ids: ids,
      trials: trials
    });
    this.summarizeSearch();
    return null
  }


  fetchSearch(page, query = this.globalSearch.refs.input.value){
    // let query = this.globalSearch.refs.input.value;
    store.dispatch({
      type: REQUEST_SEARCH,
      query: query
    });

    fetch('https://api.opentrials.net/v1/search?q=intervention%3A(' +
            // this.globalSearch.refs.input.value + ')%20OR%20public_title%3A(' +
            query + ')%20OR%20condition%3A(' +
            query + ')&page='+ page +'&per_page=100')
      .then( response => response.json())
      // .then(json => store.dispatch({
      //   type: RECEIVE_SEARCH,
      //   query: query,
      //   items: json.data.children.map(child => child.data),
      //   // totalItems: response.total_count,
      //   receivedAt: Date.now()
      // }))
      .then( (response) => {
        // Don't save the Search if there are too many results
        if (response.total_count > maxItems) {
          store.dispatch({
            type: SEARCH_TOO_BROAD,
            tooManyResults: true,
          })
        }
        this.setState({items: response.items});
        this.setState({totalItems: response.total_count});
        // Save the response
        store.dispatch({
          type: RECEIVE_SEARCH,
          query: query,
          response: this.normalizeQuery(response), // The reordered json response
          items: this.normalizeQuery(response), // An array of the trial IDs
          totalItems: response.total_count,
          receivedAt: Date.now()
        });
        // Save the search (helps with accessing the searchHistory store)
        store.dispatch({
          type: SELECT_SEARCH,
          query: query,
          totalItems: response.total_count,
        });
        //
        store.dispatch({
          type: GET_DATA_SCATTER,
          data: randomDataSet(),
        });
        this.updateSearch(query, page); //Keep fetching until the total items in the search are accessed (100 at a time limit)
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

  getYear(date){
    let d = new Date(date);
    return d.getFullYear();
  }

  summarizeSearch(){

    if (store.getState().searchState.selectedQuery.totalItems !== 0) {
      // Immutably copy the search results
      var newObject = $.extend(true, {}, store.getState().searchState.currentResults.items);
      // var newObject = store.getState().searchState.currentResults.items;  // DOOOON'T do it
      // newObject.test = 'banana';


      // loop through the search results and get the total trials for each gender
      let sumData={};

      for (let trial in newObject) {
        if (true) {

          let year = this.getYear(newObject[trial].registration_date);
          if (!sumData[year]) {
            sumData[year] = {}
          }
          let attr = 'total';
          sumData[year][attr] ? (sumData[year][attr] += 1) : (sumData[year][attr] = 1)
          if (newObject[trial].gender === 'female') {
            let attr = 'female';
            sumData[year][attr] ? (sumData[year][attr] += 1) : (sumData[year][attr] = 1)
          } else if (newObject[trial].gender === 'male') {
            let attr = 'male';
            sumData[year][attr] ? (sumData[year][attr] += 1) : (sumData[year][attr] = 1)
          } else if (newObject[trial].gender === 'both') {
            let attr = 'both';
            sumData[year][attr] ? (sumData[year][attr] += 1) : (sumData[year][attr] = 1)
          } else if (newObject[trial].gender === undefined) {
            let attr = 'na';
            sumData[year][attr] ? (sumData[year][attr] += 1) : (sumData[year][attr] = 1)
          } else {
            console.log('failure to identify gender of '+ newObject[trial].id +' in searchPage summarizeSearch()');
          }
        }
      }

      // loop through the search results and get the total trials published/unpublished
      for (let trial in newObject) {
        if (true) {
          let year = this.getYear(newObject[trial].registration_date);
          if (!sumData[year]) {
            sumData[year] = {}
          }
          if (newObject[trial].has_published_results === true) {
            let attr = 'published';
            sumData[year][attr] ? (sumData[year][attr] += 1) : (sumData[year][attr] = 1)
          } else if ((newObject[trial].status === 'ongoing') ) { //&& (parseInt(year, 10) > 2013)
            let attr = 'ongoing';
            sumData[year][attr] ? (sumData[year][attr] += 1) : (sumData[year][attr] = 1)
          } else if (newObject[trial].has_published_results === false) {
            let attr = 'unpublished';
            sumData[year][attr] ? (sumData[year][attr] += 1) : (sumData[year][attr] = 1)
          } else if (newObject[trial].publications.length === 0) {
            let attr = 'unpublished';
            sumData[year][attr] ? (sumData[year][attr] += 1) : (sumData[year][attr] = 1)
          } else if (newObject[trial].publications.length > 0) {
            let attr = 'published';
            sumData[year][attr] ? (sumData[year][attr] += 1) : (sumData[year][attr] = 1)
          } else {
            console.log('failure to identify publication status of '+ newObject[trial].id +' in searchPage summarizeSearch()');
          }
        }
      }

      // console.log("sumData: ", sumData);

      let summaryData = []
        // {year: 2006, unpublished: 0, published: 0, male: 0, female: 0, both: 0, na: 0},
      // ]
      let currentYear = new Date();
      currentYear = this.getYear(currentYear);
      let firstTrialYear = parseInt(Object.keys(sumData)[0], 10);
      let yearsInDataset = _.range(firstTrialYear, currentYear + 1);
      let attrs = ['unpublished', 'published', 'ongoing', 'male', 'female','both', 'na', 'total']

      for (var i = 0; i < yearsInDataset.length; i++) {
          let year = yearsInDataset[i];
          let yearData = {};
          yearData.year = year;
          for (let attr of attrs) {
            if (sumData[year]) {
              sumData[year][attr] ? (yearData[attr] = sumData[year][attr]) : (yearData[attr] = 0);
            } else {
              yearData[attr] = 0;
            }
          }
          summaryData[i] = yearData;
      }
      // console.log("summaryData: ", summaryData);
      this.props.dispatch({
        type: GET_DATA_BAR,
        data: summaryData,
      });

    } // closing if there was a search query
  } // closing summarizeSearch()

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
    if (store.getState().searchState.selectedQuery.query !== '') {
      let searchTerm = store.getState().searchState.selectedQuery.query;
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

    // var cyan = {
    //   'backgroundColor': 'cyan'
    // };

    return (
      <div className="search_page">
        <div className="row">
          <div className="large-12 columns search-wrapper">
            <div className="row">
              <div className="large-5 columns search-wrapper">

                  {/* SEARCH */}
                  <label>Search by Treatment or Condition</label>
                  <SearchInput  // Custom component - Search bar
                    ref={component => this.globalSearch = component} // THis can also take a callback (here we're setting as the nested class component Input)
                    update={this.update.bind(this)} // update now, not on change
                  />


                  {/* FILTER SEARCH RESULTS */}
                  <label>Filter Search Results</label>
                  <input type="text" onChange={this.filter.bind(this)} />
              </div>
              <div className="large-4 end columns" >
                  <RecentSearches {...this.props} />
              </div>
            </div>
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
    query: store.searchState.selectedQuery.query,
    items: store.searchState.searchedTrials.items,
    searchHistory: store.searchState.searchHistory,
    totalItems: store.searchState.currentResults,
    // receivedAt: store.searchState.receivedAt
  };
}

export default connect(mapStateToProps)(SearchPage);
