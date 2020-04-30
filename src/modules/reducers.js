import {
  ADD_DOCUMENT,
  UPDATE_DOCUMENT,
  DELETE_DOCUMENT,
  TOGGLE_EXCLUDED_DOCUMENT,
  SET_DOCUMENT_YEAR,
  ADD_TO_OVERRIDES,
  DELETE_FROM_OVERRIDES,
  SET_OVERRIDES,
  SET_MAP_CONTROL,
  INCLUDE_ALL,
  EXCLUDE_ALL,
  CLEAR_OVERRIDES,
} from "./actions";
import _ from "lodash";
import geocodeText from "./geocode";
import defaultWhitelist from "../utils/defaultWhitelist.json";

export const defaultState = {
  documents: {},
  mapControls: {
    scaleMarkers: 1,
    relativeSizing: true,
    threshold: 0,
    popThreshold: 15000,
    groupByState: false,
    filterFunction: () => true,
  },
  overrides: {
    blacklist: {},
    whitelist: defaultWhitelist.reduce((res, el) => {
      res[el] = true;
      return res;
    }, {}),
    associations: {},
    options: { useWhitelist: false, useAlternateNames: true },
  },
};

const refreshGeocoding = (state) => {
  Object.values(state.documents).forEach((d) => {
    d.geonames = geocodeText(
      d.text,
      state.overrides.associations,
      state.overrides.whitelist,
      state.overrides.options.useWhitelist,
      state.overrides.options.useAlternateNames,
    );
  });
  return state;
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case ADD_TO_OVERRIDES: {
      let { attribute, override } = action.payload;
      let newState = _.cloneDeep(state);
      switch (attribute) {
        case "blacklist": {
          newState.overrides.blacklist[override.literal] = true;
          return newState;
        }
        case "association": {
          newState.overrides.associations[override.fromLiteral] =
            override.toLiteral;
          newState = refreshGeocoding(newState);
          return newState;
        }
        case "whitelist": {
          newState.overrides.whitelist[override.literal] = true;
          newState = refreshGeocoding(newState);
          return newState;
        }
        default: {
          console.error("invalid case for override");
        }
      }
      return newState;
    }

    case DELETE_FROM_OVERRIDES: {
      let { attribute, override } = action.payload;
      let newState = _.cloneDeep(state);
      switch (attribute) {
        case "blacklist": {
          delete newState.overrides.blacklist[override.literal];
          return newState;
        }
        case "association": {
          delete newState.overrides.associations[override.fromLiteral];

          newState = refreshGeocoding(newState);
          return newState;
        }
        case "whitelist": {
          delete newState.overrides.whitelist[override.literal];
          newState = refreshGeocoding(newState);
          return newState;
        }
        default: {
          console.error("invalid case for override");
        }
      }

      return newState;
    }

    case CLEAR_OVERRIDES: {
      let { attribute } = action.payload;
      let newState = _.cloneDeep(state);
      newState.overrides[attribute] = {};
      newState = refreshGeocoding(newState);
      return newState;
    }

    case EXCLUDE_ALL: {
      let newState = _.cloneDeep(state);
      Object.values(newState.documents).forEach((d) => (d.excluded = true));

      return newState;
    }

    case INCLUDE_ALL: {
      let newState = _.cloneDeep(state);
      Object.values(newState.documents).forEach((d) => (d.excluded = false));

      return newState;
    }

    case SET_MAP_CONTROL: {
      let { attribute, value } = action.payload;
      let newState = _.cloneDeep(state);
      newState.mapControls[attribute] = value;

      return newState;
    }

    case SET_OVERRIDES: {
      let { attribute, value } = action.payload;
      let newState = _.cloneDeep(state);
      newState.overrides.options[attribute] = value;

      newState = refreshGeocoding(newState);

      return newState;
    }

    case SET_DOCUMENT_YEAR: {
      let { key, year } = action.payload;
      let newState = _.cloneDeep(state);
      newState.documents[key].year = year;

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
      newItem.geonames = geocodeText(
        newItem.text,
        newState.overrides.associations,
        newState.overrides.whitelist,
        newState.overrides.options.useWhitelist,
      );

      newState.documents[newItem.path] = newItem;

      return newState;
    }
    case UPDATE_DOCUMENT: {
      let newData = { ...action.payload };
      let newState = _.cloneDeep(state);

      let newItem = newState.documents[newData.path];
      newItem.text += newData.text;
      newItem.confidence =
        newItem.confidence * (newItem.degree / parseFloat(newItem.degree + 1)) +
        newData.confidence / parseFloat(newItem.degree + 1);

      newItem.degree += 1;
      newItem.loading = newData.loading;
      newItem.percentLoaded = newData.percentLoaded;

      newItem.geonames += geocodeText(
        newData.text,
        newState.overrides.associations,
        newState.overrides.whitelist,
        newState.overrides.options.useWhitelist,
      );

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
