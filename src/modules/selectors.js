import { createSelector } from "reselect";
import geonames from "../utils/geonames";
import geoData from "../utils/geo_data";
import abbreviations from "../utils/abbreviations";
import country_abbreviations from "../utils/country_abbreviations";

const getDocuments = (state) => state.documents;
const getOverrides = (state) => state.overrides;
const getMapControls = (state) => state.mapControls;

export const getFilteredMentions = createSelector(
  [getDocuments, getOverrides, getMapControls],
  (documents, overrides, mapControls) => {
    const { filterFunction } = mapControls;
    const { blacklist } = overrides;
    let mentions = {};
    Object.values(documents).forEach((doc) => {
      if (!filterFunction(doc.year) || doc.excluded) {
        return;
      }
      // filter based on blacklist
      let filteredNames = doc.geonames.filter(
        (n) => !blacklist.hasOwnProperty(n.literal),
      );

      // group by state, if applicable
      if (mapControls.groupByState) {
        filteredNames = filteredNames.map((n) =>
          geoData[n.key].type === "city"
            ? {
                key:
                  geonames[
                    geoData[n.key].country_code === "US"
                      ? keyToState(n.key)
                      : keyToCountry(n.key)
                  ],
                literal: n.literal,
              }
            : n,
        );
      }

      mentions = addMentions(mentions, filteredNames);
    });

    // compute the total number of mentions
    const totalMentions = Object.values(mentions).reduce((count, m) => {
      return count + m.count;
    }, 0);

    // determine which names are below frequency and population thresholds and remove them;
    const belowThreshold = Object.keys(mentions).filter(
      (m) =>
        geoData[m] === undefined ||
        (mentions[m].count * 100) / totalMentions < mapControls.threshold ||
        (parseInt(geoData[m].population) &&
          parseInt(geoData[m].population) < mapControls.popThreshold),
    );
    belowThreshold.forEach((key) => {
      delete mentions[key];
    });

    return { mentions: mentions, totalMentions: totalMentions };
  },
);

const keyToState = (key) =>
  abbreviations[geoData[key].admin_code].toLowerCase();

const keyToCountry = (key) => {
  console.log(
    country_abbreviations[geoData[key].country_code],
    geoData[key].country_code,
  );
  return country_abbreviations[geoData[key].country_code].toLowerCase();
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
