import React, { Component } from 'react';
// import { StickyTable, Row, Cell } from 'react-sticky-table';
import {Table, Column, Cell} from 'fixed-data-table-2';
const Dimensions = require('react-dimensions');
const {StyleSheet, css} = require('aphrodite');
// import { Link } from 'react-router';


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

// STYLING -EX
const styles = StyleSheet.create({
 wrapperStyles: {
    // marginTop: '1rem',
    // marginLeft: '1rem',
    // marginRight: '3rem',
    // border: 'none',
    // overflow:'hidden',
    // height: '100%'
  },
  newTableHeader: {
    // fontFamily: 'Courier',
    // color: '#000',
    // fontSize: '12px',
    // lineHeight: '1',
    // background: '#CCFFEE',
    // border: 'none',
  },
  newTableCell: {
    // background: 'white',
    // borderBottom: '1px solid #d3d3d3',
  }
});

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

    // Trial Titles array (because the table code below gets confused about nested data)
    let dates = [];
    let d;
    for (let item of searchedItems) {
      if (item.length !== '') {
        d = new Date(item.registration_date)
        dates.push(d)
      }
    }

    // Date.parse(searchedItems[rowIndex].registration_date).getUTCFullYear()

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
           className={css(styles.wrapperStyles)} // STYLING
           rowHeight={40}
           rowsCount={searchedItems.length}
           width={containerWidth}
           maxHeight={400}
           headerHeight={50}
           rowHeightGetter={(rowIndex) => Math.max(40, titles[rowIndex]*1.1)}

           touchScrollEnabled={true}
           {...props}>
           <Column
             columnKey="Index Column"
             header={<Cell>  </Cell>}
             cell={({rowIndex, ...props}) => (
               <Cell className={css(styles.newTableCell)} {...props}>
                {rowIndex + 1}
               </Cell>
             )}
             width={30}

             fixed={true}
           />
           <Column
             columnKey="Title Column"
             header={<Cell className={css(styles.newTableHeader)}>Title</Cell>}
             cell={({rowIndex, ...props}) => (
               <Cell className={css(styles.newTableCell)} {...props}>
                  <a href={"https://explorer.opentrials.net/trials/" + searchedItems[rowIndex].id} target={"_blank"}>
                    {searchedItems[rowIndex].public_title}
                  </a>
               </Cell>
             )}
             width={300}
            //  flexGrow={1}
           />
           {/* <Column
             columnKey="Publication Status Column"
             header={<Cell>Published?</Cell>}
             cell={({rowIndex, ...props}) => (
               <Cell className={css(styles.newTableCell)} {...props}>
                {searchedItems[rowIndex].has_published_results ? 'Yes' : 'No'}
               </Cell>
             )}
             width={200}
            //  flexGrow={1}
           /> */}
           <Column
             columnKey="Conditions Column"
             header={<Cell>Conditions</Cell>}
             cell={({rowIndex, ...props}) => (
               <Cell className={css(styles.newTableCell)} {...props}>
                 {conditions[rowIndex]}
               </Cell>
             )}
             width={200}
            //  flexGrow={1}
           />
           <Column
             columnKey="Gender Column"
             header={<Cell>Gender</Cell>}
             cell={({rowIndex, ...props}) => (
               <Cell className={css(styles.newTableCell)} {...props}>
                {searchedItems[rowIndex].gender ? searchedItems[rowIndex].gender : 'N/A'}
                 {/* Data for column 3: {rows[rowIndex][2]} */}
               </Cell>
             )}
             width={100}
            //  flexGrow={1}
           />
           <Column
             columnKey="Sample Size Column"
             header={<Cell>Sample Size</Cell>}
             cell={({rowIndex, ...props}) => (
               <Cell className={css(styles.newTableCell)} {...props}>
                {searchedItems[rowIndex].target_sample_size ? searchedItems[rowIndex].target_sample_size : 'N/A'}
               </Cell>
             )}
             width={125}
            //  flexGrow={1}
           />
           <Column
             columnKey="Sponsor Column"
             header={<Cell>Sponsor</Cell>}
             cell={({rowIndex, ...props}) => (
               <Cell className={css(styles.newTableCell)} {...props}>
                {organizations[rowIndex]}
               </Cell>
             )}
             width={200}
            //  flexGrow={1}
           />
           <Column
             columnKey="Date Column"
             header={<Cell>Start Date</Cell>}
             cell={({rowIndex, ...props}) => (
               <Cell className={css(styles.newTableCell)} {...props}>
                  {dates[rowIndex].toDateString()}
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
// https://facebook.github.io/fixed-data-table/example-object-data.html
