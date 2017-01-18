import React from 'react';
// import SearchInput from './searchBar.jsx';


export default (props) => {

  // const scales = { xScale: xScale(props), yScale: yScale(props) };
  return (
    <div>
      <p> {props.query} </p>
      {/* <p> {JSON.stringify(props.items)} </p> */}
      {/* <p> {props.searchHistory[props.query].items.map(item =>
          item)}
      </p> */}
      {/* <p> {props.items.map(item =>
          <div key={item.id}>
            <h4> {item.public_title} </h4>
          </div>
          )}
      </p> */}
    </div>
  )
}


// CLASS COMPONENT
// class SearchPageView extends React.Component {
//
//   update() {
//
//   }
//
//   render(props){
//
//
//     let items = this.props.items;
//     let totalItems = 0;
//     if(this.props.query !== '') {
//       let totalItems = this.props.searchHistory[this.props.query].totalItems
//     }
//     // console.log(items[0].sources.name === );
//     // Object.keys(items.sources)[0]
//
//     // Filtering the API results
//     // if(this.props.filter) {
//     //   items = items.filter( item =>
//     //     item.public_title.toLowerCase()
//     //     .includes(this.props.filter.toLowerCase()))
//     // }
//
//
//     return (
//       <div className="search_page">
//
//         {/* SEARCH */}
//         {/* <label>Search By Treatment or Condition</label>
//         <SearchInput  // Custom component - Search bar
//           ref={component => this.globalSearch = component} // THis can also take a callback (here we're setting as the nested class component Input)
//           update={this.update.bind(this)} // update now, not on change
//         /> */}
//
//
//         {/* FILTER SEARCH RESULTS */}
//         {/* <label>Filter Search Results</label>
//         <input type="text"
//         onChange={this.filter.bind(this)} /> */}
//
//
//         {/* Render the plot */}
//         {/* <div className="nested-plot">
//           {this.props.children}
//         </div> */}
//
//
//         {/* DISPLAY FILTERED SEARCH RESULTS -- DEV ONLY */}
//         <h5>{totalItems}</h5>
//         {this.props.items.map(item =>
//           // The elements in an array (i.e. amongst siblings) should have a unique key prop --> using the public_title below
//           <div key={item.id}>
//             <Title key={item.public_title} title={item} />
//             <p>{JSON.stringify(item.sources)}</p>
//             <p>
//               {Object.keys(item.sources).map(source =>
//                 source + " "
//               )}
//             </p>
//           </div>
//         )}
//         <p>{JSON.stringify(items)}</p>
//         <span>{ this.props.items.map(item => item.public_title) }</span>
//       </div>
//     )
//   }
// } // closing App class
//
// const Title = (props) => <h4> {props.title.public_title} </h4>
//
// SearchPageView.defaultProps = {
//   val: 0
// }
//
// export default SearchPageView;
//
//


// ----------
// var UserListContainer = React.createClass({
//   getInitialState: function() {
//     return {
//       users: []
//     }
//   },
//
//   componentDidMount: function() {
//     var _this = this;
//     axios.get('/path/to/user-api').then(function(response) {
//       _this.setState({users: response.data})
//     });
//   },
//
//   render: function() {
//     return (<UserList users={this.state.users} />);
//   }
// });
//
// module.exports = UserListContainer;
