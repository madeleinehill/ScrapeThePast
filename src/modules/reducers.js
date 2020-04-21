import { ADD_DOCUMENT, UPDATE_DOCUMENT, DELETE_ITEM } from "./actions";
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
    case ADD_DOCUMENT: {
      let newItem = { ...action.payload };
      let newState = _.cloneDeep(state);
      newItem.degree = action.payload.text ? 1 : 0;
      newState.documents[newItem.path] = newItem;
      newItem.geonames.forEach((n) => {
        let { key, literal } = n;

        // if this is the entity's first mention, add it with count zero
        if (!newState.mentions.hasOwnProperty(key)) {
          newState.mentions[key] = { count: 0, literals: {} };
        }
        // if this literal phrase hasn't been used before, add it
        if (!newState.mentions[key].literals.hasOwnProperty(literal)) {
          newState.mentions[key].literals[literal] = { count: 0 };
        }

        // increment the identity
        newState.mentions[key].count += 1;
        // note what was literally said
        newState.mentions[key].literals[literal].count += 1;
      });

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
      newData.geonames.forEach((n) => {
        let { key, literal } = n;

        // if this is the entity's first mention, add it with count zero
        if (!newState.mentions.hasOwnProperty(key)) {
          newState.mentions[key] = { count: 0, literals: {} };
        }
        // if this literal phrase hasn't been used before, add it
        if (!newState.mentions[key].literals.hasOwnProperty(literal)) {
          newState.mentions[key].literals[literal] = { count: 0 };
        }

        // increment the identity
        newState.mentions[key].count += 1;
        // note what was literally said
        newState.mentions[key].literals[literal].count += 1;
      });

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

export default reducer;
