import React, { Component } from 'react';
// import { StickyTable, Row, Cell } from 'react-sticky-table';
import {Table, Column, Cell} from 'fixed-data-table-2';
const Dimensions = require('react-dimensions');

const rows = [
  {id: '', public_title: '', gender: ' ', organisations: [{name:''}], has_published_results: '', registration_date: '', target_sample_size: ' ', conditions: [{name:''}]},
  {id: '', public_title: '', gender: ' ', organisations: [{name:''}], has_published_results: '', registration_date: '', target_sample_size: ' ', conditions: [{name:''}]},
  {id: '', public_title: '', gender: ' ', organisations: [{name:''}], has_published_results: '', registration_date: '', target_sample_size: ' ', conditions: [{name:''}]},
  {id: '', public_title: '', gender: ' ', organisations: [{name:''}], has_published_results: '', registration_date: '', target_sample_size: ' ', conditions: [{name:''}]},
  {id: '', public_title: '', gender: ' ', organisations: [{name:''}], has_published_results: '', registration_date: '', target_sample_size: ' ', conditions: [{name:''}]},
  {id: '', public_title: '', gender: ' ', organisations: [{name:''}], has_published_results: '', registration_date: '', target_sample_size: ' ', conditions: [{name:''}]},
  {id: '', public_title: '', gender: ' ', organisations: [{name:''}], has_published_results: '', registration_date: '', target_sample_size: ' ', conditions: [{name:''}]},
  {id: '', public_title: '', gender: ' ', organisations: [{name:''}], has_published_results: '', registration_date: '', target_sample_size: ' ', conditions: [{name:''}]}
  // .... and more organisations.name
];

// export default (props) => {
export default class SearchTable extends Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {

    // const {height, width, containerHeight, containerWidth, ...props} = this.props;
    const {containerWidth, ...props} = this.props;

    // Conditional base dataset depending on API response
    let searchedItems;
    if (props.totalItems.resultsReceived === false) {
      searchedItems = rows;
    } else {
      searchedItems = props.totalItems.items;
    }

    // Trial Titles array (because the table code below gets confused about nested data)
    let titles = [];
    for (let item of searchedItems) {
      titles.push(item.public_title.length)
    }
    //Trial Conditions
    let conditions = [];
    for (let item of searchedItems) {
      let cs = item.conditions
      for (let name of cs) {
        conditions.push(name.name)
      }
    }
    //Trial Organizations
    let organizations = [];
    for (let item of searchedItems) {
      let os = item.organisations
      if (os.length !== 0) {
        organizations.push(os[0].name)
      } else {
        organizations.push("N/A")
      }
    }
    // console.log(organizations);


    return (
        <div>
          {/* <p>{searchedItems.length}</p>
          <p>{searchedItems[0].public_title}</p> */}
          {/* <p>{JSON.stringify(props.totalItems[0])}</p> */}
          {/* <p>{props.totalItems[0].public_title}</p> */}
          {/* {console.log("RENDERING: ", props.totalItems.items[0].public_title)} */}
          {/* <p className="titleddd">{props.totalItems[0].public_title}</p> */}
          {/* <div> {props.totalItems.items.map(item =>
              <div key={item.id}>
                <h4> {item.public_title} </h4>
              </div>
              )}
          </div> */}

        <Table
           rowHeight={40}
           rowsCount={searchedItems.length}
           width={containerWidth}
           maxHeight={400}
           headerHeight={50}
           rowHeightGetter={(rowIndex) => Math.max(40, titles[rowIndex]*1.1)}

           touchScrollEnabled={true}
           {...props}>
           <Column
             columnKey="Column1"
             header={<Cell>  </Cell>}
             cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                {rowIndex + 1}
               </Cell>
             )}
             width={30}

             fixed={true}
           />
           <Column
             columnKey="Column2"
             header={<Cell>Title</Cell>}
             cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                {searchedItems[rowIndex].public_title}
               </Cell>
             )}
             width={300}
            //  flexGrow={1}
           />
           {/* <Column
             columnKey="Column3"
             header={<Cell>Published?</Cell>}
             cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                {searchedItems[rowIndex].has_published_results ? 'Yes' : 'No'}
               </Cell>
             )}
             width={200}
            //  flexGrow={1}
           /> */}
           <Column
             columnKey="Column4"
             header={<Cell>Conditions</Cell>}
             cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                 {conditions[rowIndex]}
               </Cell>
             )}
             width={200}
            //  flexGrow={1}
           />
           <Column
             columnKey="Column5"
             header={<Cell>Gender</Cell>}
             cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                {searchedItems[rowIndex].gender ? searchedItems[rowIndex].gender : 'N/A'}
                 {/* Data for column 3: {rows[rowIndex][2]} */}
               </Cell>
             )}
             width={100}
            //  flexGrow={1}
           />
           <Column
             columnKey="Column6"
             header={<Cell>Sample Size</Cell>}
             cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                {searchedItems[rowIndex].target_sample_size ? searchedItems[rowIndex].target_sample_size : 'N/A'}
               </Cell>
             )}
             width={125}
            //  flexGrow={1}
           />
           <Column
             columnKey="Column7"
             header={<Cell>Sponsor</Cell>}
             cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                {organizations[rowIndex]}
               </Cell>
             )}
             width={200}
            //  flexGrow={1}
           />
        </Table>
      </div>

    );
  } // Closing Render
} // Closing the Class



// Viewport Responsive
// See react-dimensions for the best way to configure
// https://github.com/digidem/react-dimensions
// http://schrodinger.github.io/fixed-data-table-2/example-responsive.html
module.exports = Dimensions({
  // Uncomment the below out if you want the window size alone to dtmn the width
  // getHeight: function(element) {
  //   return window.innerHeight - 200;
  // },
  // getWidth: function(element) {
  //   var widthOffset = window.innerWidth < 680 ? 0 : 240;
  //   return window.innerWidth - widthOffset;
  // }
})(SearchTable);

// Touch Scroll
// http://schrodinger.github.io/fixed-data-table-2/example-touch-scroll.html
// module.exports = SearchTable;
