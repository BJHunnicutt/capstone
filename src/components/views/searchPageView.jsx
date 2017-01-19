import React from 'react';
import SearchTable from './searchTable.js';

// import SearchInput from './searchBar.jsx';


export default (props) => {

  // const scales = { xScale: xScale(props), yScale: yScale(props) };
  return (
    <div>
      {/* <p> {props.query} </p> */}
      {/* <p> {JSON.stringify(props.items)} </p> */}
      {/* <p> {JSON.stringify(props.totalItems[0][0])} </p> */}

      {/* <p> {props.totalItems.map(item =>
          <div key={item.id}>
            <h4> {item.public_title} </h4>
          </div>
          )}
      </p> */}

      <div id="search-table-wrapper">
        <SearchTable {...props}/>
      </div>
      }
    </div>
  )
}
