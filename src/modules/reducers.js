import {
  ADD_DOCUMENT,
  UPDATE_DOCUMENT,
  DELETE_ITEM,
  TOGGLE_EXCLUDED_DOCUMENT,
} from "./actions";
import _ from "lodash";

export const defaultState = {
  documents: {},
  mentions: {},
  blacklist: {
    aid: true,
    was: true,
    eld: true,
    liberal: true,
    union: true,
    "the bank": true,
    "the d": true,
    rome: true,
    slaughter: true,
  },
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case TOGGLE_EXCLUDED_DOCUMENT: {
      let itemUrl = action.payload;
      let newState = _.cloneDeep(state);
      newState.documents[itemUrl].excluded = !newState.documents[itemUrl]
        .excluded;

      if (newState.documents[itemUrl].excluded) {
        newState.mentions = subtractMentions(
          newState.mentions,
          newState.documents[itemUrl].geonames,
        );
      } else {
        newState.mentions = addMentions(
          newState.mentions,
          newState.documents[itemUrl].geonames,
        );
      }

      return newState;
    }
    case ADD_DOCUMENT: {
      let newItem = { ...action.payload };
      let newState = _.cloneDeep(state);
      newItem.degree = action.payload.text ? 1 : 0;
      newItem.excluded = false;

      newState.documents[newItem.path] = newItem;

      newState.mentions = addMentions(newState.mentions, newItem.geonames);

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

      newState.mentions = addMentions(newState.mentions, newData.geonames);

      return newState;
    }

    case DELETE_ITEM: {
      let newState = _.cloneDeep(state);
      let index = _.findIndex(newState.documents, { id: action.payload });
      newState.documents.splice(index, 1);
      return newState;
    }

    default:
      return state;
  }
};

const addMentions = (mentions, geonames) => {
  geonames.forEach((n) => {
    let { key, literal } = n;

    // if this is the entity's first mention, add it with count zero
    if (!mentions.hasOwnProperty(key)) {
      mentions[key] = { count: 0, literals: {} };
    }
    // if this literal phrase hasn't been used before, add it
    if (!mentions[key].literals.hasOwnProperty(literal)) {
      mentions[key].literals[literal] = { count: 0 };
    }

    // increment the identity
    mentions[key].count += 1;
    // note what was literally said
    mentions[key].literals[literal].count += 1;
  });
  return mentions;
};

const subtractMentions = (mentions, geonames) => {
  geonames.forEach((n) => {
    let { key, literal } = n;

    // if this is the entity's first mention, add it with count zero
    if (!mentions.hasOwnProperty(key)) {
      mentions[key] = { count: 0, literals: {} };
    }
    // if this literal phrase hasn't been used before, add it
    if (!mentions[key].literals.hasOwnProperty(literal)) {
      mentions[key].literals[literal] = { count: 0 };
    }

    // increment the identity
    mentions[key].count -= 1;
    // note what was literally said
    mentions[key].literals[literal].count -= 1;
  });
  return mentions;
};

export default reducer;
