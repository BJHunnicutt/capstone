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


      let textLength = []; let conditions = []; let conditionList = ''; let interventionList = ''; let interventions = []; let organizations = []; let dates = [];

      //Trial Conditions
      for (let item of searchedItems) {
        let cs = item.conditions;
        let first = true;
        for (let c of cs) {
          first ? conditionList = conditionList.concat(c.name) : conditionList = conditionList.concat(', ', c.name);
          first = false;
        }
        conditions.push(conditionList);
        conditionList = '';
      }

      //Trial Interventions
      for (let item of searchedItems) {
        if (item.id !== "") {
          let is = item.interventions;
          let first = true;
          for (let i of is) {
            first ? interventionList = interventionList.concat(i.name) : interventionList = interventionList.concat(', ', i.name);
            first = false;
          }
          interventions.push(interventionList);
          interventionList = '';
        }
      }

      //Trial Organizations
      for (let item of searchedItems) {
        let os = item.organisations
        if (os.length !== 0) {
          organizations.push(os[0].name)
        } else {
          organizations.push("N/A")
        }
      }

      // Date array (because the table code below gets confused about nested data)
      let d;
      for (let item of searchedItems) {
        if (item.length !== '') {
          d = new Date(item.registration_date)
          dates.push(d)
        }
      }

      // Finding the longest thing the title, the list of conditions or the list of interventions --> dtmns row height
      let i = 0;
      for (let item of searchedItems) {
        // if (item.id !== "") {
        //   let longest = 0;
        //   if (item.public_title.length > interventions[i].length) {
        //      longest = item.public_title.length
        //      if (!(item.public_title.length > conditions[i].length)) {
        //        longest = conditions[i].length
        //      }
        //    } else {
        //      longest = interventions[i].length
        //      if (!(interventions[i].length > conditions[i].length)) {
        //        longest = conditions[i].length
        //      }
        //    }
        //   textLength.push(longest)
        //   console.log('longest: ', longest, ' title: ', item.public_title.length, ' int: ', interventions[i].length, ' cond: ', conditions[i].length);
        // } else {
        //   textLength.push(item.public_title.length)
        // }
        // i += 1;
        textLength.push(item.public_title.length)
        if (item.id !== "") {
          if (conditions[i].length >= item.public_title.length && conditions[i].length > 30) {
            conditions[i] = (conditions[i].substring(0, (item.public_title.length - 35)) + "...");
          } else if (interventions[i].length >= item.public_title.length && interventions[i].length > 40) {
            interventions[i] = (interventions[i].substring(0, (item.public_title.length - 20)) + "...");
          }
        }
        i += 1;
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
           rowHeightGetter={(rowIndex) => Math.max(40, textLength[rowIndex]*1.1)}

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
             width={40}

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
             header={<Cell>Conditions Tested</Cell>}
             cell={({rowIndex, ...props}) => (
               <Cell className={css(styles.newTableCell)} {...props}>
                 {conditions[rowIndex]}
               </Cell>
             )}
             width={175}
            //  flexGrow={1}
           />
           <Column
             columnKey="Treatments Column"
             header={<Cell>Treatments Tested</Cell>}
             cell={({rowIndex, ...props}) => (
               <Cell className={css(styles.newTableCell)} {...props}>
                 {interventions[rowIndex]}
               </Cell>
             )}
             width={225}
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
             header={<Cell>Year</Cell>}
             cell={({rowIndex, ...props}) => (
               <Cell className={css(styles.newTableCell)} {...props}>
                  {dates[rowIndex].getUTCFullYear()}
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
