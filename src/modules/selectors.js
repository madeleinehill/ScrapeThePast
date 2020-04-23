import { createSelector } from "reselect";
import geonames from "../utils/geonames";
import geoData from "../utils/geo_data";
import abbreviations from "../utils/abbreviations";

const getDocuments = (state) => state.documents;
const getFilterFunction = (state) => state.filterFunction;
const getBlackList = (state) => state.blacklist;
const getSubstitutions = (state) => state.substitutions;
const getMapControls = (state) => state.mapControls;

export const getFilteredMentions = createSelector(
  [
    getDocuments,
    getFilterFunction,
    getBlackList,
    getSubstitutions,
    getMapControls,
  ],
  (documents, filterFunction, blacklist, substitutions, mapControls) => {
    let mentions = {};
    Object.values(documents).forEach((doc) => {
      if (!filterFunction(doc.year) || doc.excluded) {
        return;
      }
      let filteredNames = doc.geonames
        // apply any substitutions
        .map((n) =>
          substitutions.hasOwnProperty(n.literal)
            ? { key: geonames[substitutions[n.literal]], literal: n.literal }
            : n,
        )
        // filter based on blacklist
        .filter((n) => !blacklist.hasOwnProperty(n.literal));

      // group by state, if applicable
      if (mapControls.groupByState) {
        filteredNames = filteredNames.map((n) =>
          geoData[n.key].type === "city"
            ? { key: geonames[keyToState(n.key)], literal: n.literal }
            : n,
        );
      }

      mentions = addMentions(mentions, filteredNames);
    });
    return mentions;
  },
);

export const getTotalMentions = createSelector(
  [getDocuments, getFilterFunction, getBlackList],
  (documents, filterFunction, blacklist) => {
    let total = 0;
    Object.values(documents).forEach((doc) => {
      if (!filterFunction(doc.year) || doc.excluded) {
        return;
      }
      total += doc.geonames.filter((n) => !blacklist.hasOwnProperty(n)).length;
    });
    return total;
  },
);

const keyToState = (key) =>
  abbreviations[geoData[key].admin_code].toLowerCase();

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
