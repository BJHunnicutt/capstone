import React, { Component } from 'react';
// import { StickyTable, Row, Cell } from 'react-sticky-table';
import {Table, Column, Cell} from 'fixed-data-table-2';
const Dimensions = require('react-dimensions');

const rows = [
  ['a1', 'b1', 'c1'],
  ['a2', 'b2', 'c2'],
  ['a3', 'b3', 'c3'],
  ['a1', 'b1', 'c1'],
  ['a2', 'b2', 'c2'],
  ['a3', 'b3', 'c3'],
  ['a1', 'b1', 'c1'],
  ['a2', 'b2', 'c2'],
  ['a3', 'b3', 'c3'],
  ['a1', 'b1', 'c1'],
  ['a2', 'b2', 'c2'],
  ['a3', 'b3', 'c3'],
  ['a1', 'b1', 'c1'],
  ['a2', 'b2', 'c2'],
  ['a3', 'b3', 'c3'],
  // .... and more
];

// export default (props) => {
export default class SearchTable extends Component {
  constructor(props) {
   super(props);
}

  render() {
    const {height, width, containerHeight, containerWidth, ...props} = this.props;

    return (
        <Table
           rowHeight={40}
           rowsCount={rows.length}
           width={containerWidth}
           height={400}
           headerHeight={50}
           touchScrollEnabled={true}
           {...props}>
           <Column
             columnKey="Column1"
             header={<Cell>Col 1</Cell>}
             cell={<Cell>Column 1</Cell>}
             width={100}
            //  flexGrow={1}
             fixed={true}
           />
           <Column
             columnKey="Column2"
             header={<Cell>Col 2</Cell>}
             cell={<Cell>Column 2 static content</Cell>}
             width={200}
            //  flexGrow={1}
           />
           <Column
             columnKey="Column3"
             header={<Cell>Col 3</Cell>}
             cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                 Data for column 3: {rows[rowIndex][2]}
               </Cell>
             )}
             width={200}
            //  flexGrow={1}
           />
           <Column
             columnKey="Column4"
             header={<Cell>Col 4</Cell>}
             cell={({rowIndex, ...props}) => (
               <Cell {...props}>
                 Data for column 4: {rows[rowIndex][2]}
               </Cell>
             )}
             width={200}
            //  flexGrow={1}
           />
        </Table>

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
