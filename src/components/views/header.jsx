import React from 'react';
import { Link } from 'react-router';


export default (props) => {
  return (
    <header className="primary-header">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/test">Test Plot</Link></li>
        <li><Link to="/search">Search</Link></li>
      </ul>
    </header>
  )
}
