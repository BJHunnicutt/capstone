import React from 'react';


// 
export default class SearchInput extends React.Component {
  render(){
    return (
      <span>
        <input ref="input" type="text"/>
        <button className='button' onClick={this.props.update}>search</button>
      </span>
    )
  }
}
