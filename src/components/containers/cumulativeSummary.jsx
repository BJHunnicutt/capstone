import React from 'react';
import store from '../../store.js'
import $ from 'jquery'
import _ from 'lodash'


export default function (query) {

  let sdata = summarizeCumulativeSearch();

  return sdata;

}



const getYear = (date) => {
  let d = new Date(date);
  return d.getFullYear();
}

const summarizeCumulativeSearch = () => {

  if (store.getState().searchState.selectedQuery.totalItems !== 0) {
    // Immutably copy the search results
    var newObject = $.extend(true, {}, store.getState().searchState.currentResults.items);
    // var newObject = store.getState().searchState.currentResults.items;  // DOOOON'T do it
    // newObject.test = 'banana';

    let baseYear = {
      year: 0,
      published: {
        total: {trials: 0, participants: 0, unreported: 0},
        female: {trials: 0, participants: 0, unreported: 0},
        male: {trials: 0, participants: 0, unreported: 0},
        both: {trials: 0, participants: 0, unreported: 0},
        na: {trials: 0, participants: 0, unreported: 0}      },
      unpublished: {
        total: {trials: 0, participants: 0, unreported: 0},
        female: {trials: 0, participants: 0, unreported: 0},
        male: {trials: 0, participants: 0, unreported: 0},
        both: {trials: 0, participants: 0, unreported: 0},
        na: {trials: 0, participants: 0, unreported: 0}
      },
      ongoing: {
        total: {trials: 0, participants: 0, unreported: 0},
        female: {trials: 0, participants: 0, unreported: 0},
        male: {trials: 0, participants: 0, unreported: 0},
        both: {trials: 0, participants: 0, unreported: 0},
        na: {trials: 0, participants: 0, unreported: 0}
      }
    };


    // loop through the search results and get the total trials for each gender
    let sumData={};

    // loop through the search results and get the total trials published/unpublished
    for (let trial in newObject) {
      if (true) {
        let year = getYear(newObject[trial].registration_date);
        // First time accessing this year?
        if (!sumData[year]) {
          sumData[year] = $.extend(true, {}, baseYear);
        }
        // Results Published?
        if (newObject[trial].has_published_results === true) {
          let pub = 'published';
          sumData[year][pub].total.trials += 1;
          // Sample Size Reported?
          if (newObject[trial].target_sample_size) {
            sumData[year][pub].total.participants += newObject[trial].target_sample_size;
            // Target gender?
            if (newObject[trial].gender === undefined) {
              var gen = 'na';
            } else {
              var gen = newObject[trial].gender;
            }
            sumData[year][pub][gen].trials += 1;
            sumData[year][pub][gen].participants += newObject[trial].target_sample_size;
          // If sample Size NOT Reported...
          } else {
            sumData[year][pub].total.unreported += 1;
            // Target gender?
            if (newObject[trial].gender === undefined) {
              var gen = 'na';
            } else {
              var gen = newObject[trial].gender;
            }
            sumData[year][pub][gen].trials += 1;
            sumData[year][pub][gen].unreported += 1;
          }
        } // Closing PUBLISHED

        // Study Ongoing?
        else if (newObject[trial].status === 'ongoing') {
          let pub = 'ongoing';
          sumData[year][pub].total.trials += 1;
          // Sample Size Reported?
          if (newObject[trial].target_sample_size) {
            sumData[year][pub].total.participants += newObject[trial].target_sample_size;
            // Target gender?
            if (newObject[trial].gender === undefined) {
              var gen = 'na';
            } else {
              var gen = newObject[trial].gender;
            }
            sumData[year][pub][gen].trials += 1;
            sumData[year][pub][gen].participants += newObject[trial].target_sample_size;
          // If sample Size NOT Reported...
          } else {
            sumData[year][pub].total.unreported += 1;
            // Target gender?
            if (newObject[trial].gender === undefined) {
              var gen = 'na';
            } else {
              var gen = newObject[trial].gender;
            }
            sumData[year][pub][gen].trials += 1;
            sumData[year][pub][gen].unreported += 1;
          }
        } // Closing ONGOING

        // Results Unpublished?
        else if (newObject[trial].has_published_results === false) {
          let pub = 'unpublished';
          sumData[year][pub].total.trials += 1;
          // Sample Size Reported?
          if (newObject[trial].target_sample_size) {
            sumData[year][pub].total.participants += newObject[trial].target_sample_size
            // Target gender?
            if (newObject[trial].gender === undefined) {
              var gen = 'na';
            } else {
              var gen = newObject[trial].gender;
            }
            sumData[year][pub][gen].trials += 1;
            sumData[year][pub][gen].participants += newObject[trial].target_sample_size;
          // If sample Size NOT Reported...
          } else {
            sumData[year][pub].total.unreported += 1;
            // Target gender?
            if (newObject[trial].gender === undefined) {
              var gen = 'na';
            } else {
              var gen = newObject[trial].gender;
            }
            sumData[year][pub][gen].trials += 1;
            sumData[year][pub][gen].unreported += 1;
          }
        } // Closing UNPUBLISHED

        // None of the above are true and there are NO publications listed?
        else if (newObject[trial].publications.length === 0) {
          let pub = 'unpublished';
          sumData[year][pub].total.trials += 1;
          // Sample Size Reported?
          if (newObject[trial].target_sample_size) {
            sumData[year][pub].total.participants += newObject[trial].target_sample_size
            // Target gender?
            if (newObject[trial].gender === undefined) {
              var gen = 'na';
            } else {
              var gen = newObject[trial].gender;
            }
            sumData[year][pub][gen].trials += 1;
            sumData[year][pub][gen].participants += newObject[trial].target_sample_size;
          // If sample Size NOT Reported...
          } else {
            sumData[year][pub].total.unreported += 1;
            // Target gender?
            if (newObject[trial].gender === undefined) {
              var gen = 'na';
            } else {
              var gen = newObject[trial].gender;
            }
            sumData[year][pub][gen].trials += 1;
            sumData[year][pub][gen].unreported += 1;
          }
        } // Closing UNPUBLISHED w/ no publications

        // None of the above are true and there ARE publications listed?
        else if (newObject[trial].publications.length > 0) {
          let pub = 'published';
          sumData[year][pub].total.trials += 1;
          // Sample Size Reported?
          if (newObject[trial].target_sample_size) {
            sumData[year][pub].total.participants += newObject[trial].target_sample_size
            // Target gender?
            if (newObject[trial].gender === undefined) {
              var gen = 'na';
            } else {
              var gen = newObject[trial].gender;
            }
            sumData[year][pub][gen].trials += 1;
            sumData[year][pub][gen].participants += newObject[trial].target_sample_size;
          // If sample Size NOT Reported...
          } else {
            sumData[year][pub].total.unreported += 1;
            // Target gender?
            if (newObject[trial].gender === undefined) {
              var gen = 'na';
            } else {
              var gen = newObject[trial].gender;
            }
            sumData[year][pub][gen].trials += 1;
            sumData[year][pub][gen].unreported += 1;
          }
        } // Closing PUBLISHED w/ publications listed

        else {
          console.log('failure to identify publication status of '+ newObject[trial].id +' in searchPage summarizeSearch() : ', newObject[trial].public_title);
        }
      }
    }

    // console.log("sumData: ", sumData);

    let summaryData = []
      // {year: 2006, unpublished: 0, published: 0, male: 0, female: 0, both: 0, na: 0},
    // ]
    let currentYear = new Date();
    currentYear = getYear(currentYear);
    let firstTrialYear = parseInt(Object.keys(sumData)[0], 10);
    let yearsInDataset = _.range(firstTrialYear, currentYear + 1);

    var yearData = $.extend(true, {}, baseYear);

    for (var i = 0; i < yearsInDataset.length; i++) {
      var year = yearsInDataset[i];
      // var yearData = {};
      // // If the year of the current looop isn't in the dataset, add a blank baseYear
      if (sumData[year]) {
        let pubs = ['unpublished', 'published', 'ongoing'];
        let gens = ['male', 'female','both', 'na', 'total'];
        let reps = ['trials', 'participants', 'unreported'];
        for (let pub of pubs) {
          for (let gen of gens) {
            for (let rep of reps) {
              i === 0 ? yearData[pub][gen][rep] = sumData[year][pub][gen][rep] : yearData[pub][gen][rep] = sumData[year][pub][gen][rep] + summaryData[i-1][pub][gen][rep];
            }
          }
        }

      } else {
        yearData = $.extend(true, {}, summaryData[i-1])
      }
      yearData.year = year;



      summaryData[i] = $.extend(true, {}, yearData);
    }
    // console.log("summaryData: ", summaryData);

    // store.dispatch({
    //   type: GET_DATA_BAR,
    //   data: summaryData,
    // });
    return {sumData, summaryData};

  } // closing if there was a search query
} // closing summarizeSearch()
