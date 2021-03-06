export let styles = {
  item: {
    padding: '2px 6px',
    cursor: 'default'
  },

  highlightedItem: {
    // color: 'white',
    background: 'rgb(227, 218, 172)',//'hsl(200, 50%, 50%)',
    padding: '2px 6px',
    cursor: 'default'
  },

  menu: {
    border: 'solid 1px #ccc',
    width: 'auto',
    hight: '30%',
    position: 'fixed',
    left: 'auto',
    right: '2vw',
    backgroundColor: 'white',
  }
}


export function matchStateToTerm (graph, value) {
  return (
    graph.allNames.toLowerCase().indexOf(value.toLowerCase()) !== -1
    // ||
    // state.abbr.toLowerCase().indexOf(value.toLowerCase()) !== -1
  )
}

/**
 * An example of how to implement a relevancy-based sorting method. States are
 * sorted based on the location of the match - For example, a search for "or"
 * will return "Oregon" before "North Carolina" even though "North Carolina"
 * would normally sort above Oregon. Strings where the match is in the same
 * location (or there is no match) will be sorted alphabetically - For example,
 * a search for "or" would return "North Carolina" above "North Dakota".
 */
export function sortStates (a, b, value) {
  const aLower = a.allNames.toLowerCase();
  const bLower = b.allNames.toLowerCase();
  const valueLower = value.toLowerCase();
  const queryPosA = aLower.indexOf(valueLower);
  const queryPosB = bLower.indexOf(valueLower);
  if (queryPosA !== queryPosB) {
    return queryPosA - queryPosB;
  }
  return aLower < bLower ? -1 : 1;
}

// export function fakeRequest (value, cb) {
//   if (value === '')
//     return getStates()
//   var items = getStates().filter((state) => {
//     return matchStateToTerm(state, value)
//   })
//   setTimeout(() => {
//     cb(items)
//   }, 500)
// }
