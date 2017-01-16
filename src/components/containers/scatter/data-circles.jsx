// // unfinished/src/components/data-circles.jsx
// import React from 'react';
//
// const renderCircles = (props) => {
//   return (coords, index) => { //coords are being passed as props below in .map(renderCircles(props))
//     const circleProps = {
//       cx: props.xScale(coords[0]),
//       cy: props.yScale(coords[1]),
//       r: 2,
//       key: index
//     };
//     return <circle {...circleProps} />;
//   };
// };
//
// export default (props) => {
//   // props.data.map( (props) => { // the props going in are an array of length 2
//   //   console.log(props);
//   // })
//   return <g>{ props.data.map(renderCircles(props)) }</g>
// }

// unfinished/src/components/x-y-axis.jsx
import React  from 'react';
import Circle   from './circle';

const renderCircles = (props) => {
  return (coords, index) => { //coords are being passed as props below in .map(renderCircles(props))
    const circleProps = {
      cx: props.xScale(coords[0]),
      cy: props.yScale(coords[1]),
      r: 2,
      key: index
    };
    return <Circle {...circleProps} />;
  };
};

export default (props) => {
  return <g>{ props.data.map(renderCircles(props)) }</g>
}
