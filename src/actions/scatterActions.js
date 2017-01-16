import * as types from '../actions/action-types';

export function getDataScatter(data) {
  return {
    type: types.GET_DATA_SCATTER,
    data
  };
}
