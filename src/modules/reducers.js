import {
  ADD_DOCUMENT,
  UPDATE_DOCUMENT,
  DELETE_DOCUMENT,
  TOGGLE_EXCLUDED_DOCUMENT,
  SET_FILTER_FUNCTION,
  SET_DOCUMENT_YEAR,
  ADD_TO_BLACKLIST,
  DELETE_FROM_BLACKLIST,
  ADD_TO_SUBSTITUTIONS,
  DELETE_FROM_SUBSTITUTIONS,
  SET_MAP_CONTROL,
} from "./actions";
import _ from "lodash";

export const defaultState = {
  documents: {},
  filterFunction: () => true,
  mapControls: { scaleMarkers: 1, relativeSizing: true },
  blacklist: {},
  substitutions: {},
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case ADD_TO_BLACKLIST: {
      let { literal } = action.payload;
      let newState = _.cloneDeep(state);
      newState.blacklist[literal] = true;

      return newState;
    }

    case DELETE_FROM_BLACKLIST: {
      let { literal } = action.payload;
      let newState = _.cloneDeep(state);
      delete newState.blacklist[literal];

      return newState;
    }

    case ADD_TO_SUBSTITUTIONS: {
      let { fromLiteral, toLiteral } = action.payload;
      let newState = _.cloneDeep(state);
      newState.substitutions[fromLiteral] = toLiteral;

      return newState;
    }

    case DELETE_FROM_SUBSTITUTIONS: {
      let { literal } = action.payload;
      let newState = _.cloneDeep(state);
      delete newState.substituions[literal];

      return newState;
    }

    case SET_MAP_CONTROL: {
      let { attribute, value } = action.payload;
      let newState = _.cloneDeep(state);
      newState.mapControls[attribute] = value;

      return newState;
    }

    case SET_DOCUMENT_YEAR: {
      let { key, year } = action.payload;
      let newState = _.cloneDeep(state);
      newState.documents[key].year = year;

      return newState;
    }
    case SET_FILTER_FUNCTION: {
      let newState = _.cloneDeep(state);
      newState.filterFunction = action.payload;

      return newState;
    }
    case TOGGLE_EXCLUDED_DOCUMENT: {
      let itemUrl = action.payload;
      let newState = _.cloneDeep(state);
      newState.documents[itemUrl].excluded = !newState.documents[itemUrl]
        .excluded;

      return newState;
    }
    case ADD_DOCUMENT: {
      let newItem = { ...action.payload };
      let newState = _.cloneDeep(state);
      newItem.degree = action.payload.text ? 1 : 0;
      newItem.excluded = false;
      newItem.year = action.payload.year ? parseInt(action.payload.year) : "";

      newState.documents[newItem.path] = newItem;

      return newState;
    }
    case UPDATE_DOCUMENT: {
      console.log(action);

      let newData = { ...action.payload };
      let newState = _.cloneDeep(state);

      let newItem = newState.documents[newData.path];
      newItem.text += newData.text;
      newItem.confidence =
        newItem.confidence * (newItem.degree / parseFloat(newItem.degree + 1)) +
        newData.confidence / parseFloat(newItem.degree + 1);

      newItem.degree += 1;
      newItem.geonames += newData.geonames;
      newItem.loading = newData.loading;
      newItem.percentLoaded = newData.percentLoaded;

      return newState;
    }

    case DELETE_DOCUMENT: {
      let newState = _.cloneDeep(state);
      delete newState.documents[action.payload];
      return newState;
    }

    default:
      return state;
  }
};

export default reducer;
