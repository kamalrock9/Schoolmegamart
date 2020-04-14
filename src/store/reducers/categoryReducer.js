import {FETCH_CATEGORIES, SUCCESS_SUFFIX, FAIL_SUFFIX} from "../actions/actionTypes";

const initialState = {
  loading: false,
};
export const categoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CATEGORIES:
      return {...state, loading: true};
    case FETCH_CATEGORIES + SUCCESS_SUFFIX:
      let data = action.payload.data ? convert(action.payload.data) : [];
      return {...state, data: data, loading: false};
    case FETCH_CATEGORIES + FAIL_SUFFIX:
      return {...state, error: action.error, loading: false};
    default:
      return state;
  }
};

const convert = dataList => {
  Object.keys(dataList).forEach(key => {
    dataList[key].isExpanded = false;
  });
  let tree = [],
    mappedArr = {},
    arrElem,
    mappedElem;
  // First map the nodes of the array to an object -> create a hash table.
  for (let i = 0, len = dataList.length; i < len; i++) {
    arrElem = dataList[i];
    mappedArr[arrElem.id] = arrElem;
    mappedArr[arrElem.id]["children"] = [];
  }
  for (let id in mappedArr) {
    if (mappedArr.hasOwnProperty(id)) {
      mappedElem = mappedArr[id];
      // If the element is not at the root level, add it to its parent array of children.
      if (mappedElem.parent != 0) {
        mappedArr[mappedElem["parent"]]["children"].push(mappedElem);
      }
      // If the element is at the root level, add it to first level elements array.
      else {
        tree.push(mappedElem);
      }
    }
  }
  return tree;
};
