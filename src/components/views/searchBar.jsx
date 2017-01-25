import React from 'react';

export default class SearchInput extends React.Component {
  // A method to make the search submit if you hit enter (in addition to clicking search button)
  handleKeyPress(target) {
    if(target.charCode === 13){
      this.props.update();
    }
  }

  render(){
    return (
      <span>
        <input ref="input" type="text" placeholder='search' onKeyPress={this.handleKeyPress.bind(this)}/>
        {/* <button className='button' onClick={this.props.update}>search</button> */}

        <button className="button icon-btn" ><i className="material-icons" onClick={this.props.update}>search</i></button>
        {/* <a className="icon-img" href="https://github.com/BJHunnicutt">
          <img src={icon} alt="search button" title="GitHub"/>
        </a> */}

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
