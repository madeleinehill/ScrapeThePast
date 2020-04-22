import { createSelector } from "reselect";

const getDocuments = (state) => state.documents;
const getFilterFunction = (state) => state.filterFunction;
const getBlackList = (state) => state.blacklist;

export const getFilteredMentions = createSelector(
  [getDocuments, getFilterFunction, getBlackList],
  (documents, filterFunction, blacklist) => {
    let mentions = {};
    Object.values(documents).forEach((doc) => {
      if (!filterFunction(doc.year) || doc.excluded) {
        return;
      }
      mentions = addMentions(
        mentions,
        doc.geonames.filter((n) => !blacklist.hasOwnProperty(n)),
      );
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

const addMentions = (mentions, geonames) => {
  geonames.forEach((n) => {
    let { key, literal } = n;

    if (key === undefined) {
      console.log(n);
    }

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
