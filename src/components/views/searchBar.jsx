import React from 'react';

export default class SearchInput extends React.Component {


  render(){
    return (
      <span>
        <input ref="input" type="text" placeholder='search'/>
        <button className='button' onClick={this.props.update}>search</button>
      </span>
    )
  }
}

// // The "Stateless Functional Component" way --> DOESN'T WORK at the moment
// var SearchInput = (props) => {
//   return (
//     <span>
//       <input ref="input" type="text"/>
//       <button className='button' onClick={props.update}>search</button>
//     </span>
//   );
// };
// export default SearchInput;
