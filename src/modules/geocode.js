import geonamesRaw from "../utils/geonames";
import altnames from "../utils/altnames.json";

export default (
  text,
  associations,
  whitelist,
  useWhitelist,
  useAlternateNames,
) => {
  let geonamesUnfiltered = { ...geonamesRaw };
  console.log(Object.keys(geonamesUnfiltered).length);
  if (useAlternateNames) {
    geonamesUnfiltered = { ...geonamesUnfiltered, ...altnames };
  }
  console.log(Object.keys(geonamesUnfiltered).length);

  // apply associations to geonames
  Object.keys(associations).forEach((w) => {
    geonamesUnfiltered[w] = geonamesUnfiltered[associations[w]];
  });

  let geonames = { ...geonamesUnfiltered };

  // apply whitelist if applicable
  if (useWhitelist) {
    geonames = {};
    let whitelist_codes = new Set(
      Object.keys(whitelist).map((w) => geonamesUnfiltered[w]),
    );
    Object.keys(geonamesUnfiltered).forEach((w) => {
      if (whitelist_codes.has(geonamesUnfiltered[w])) {
        geonames[w] = geonamesUnfiltered[w];
      }
    });
  }

  // generate prefix data structure
  const prefixes = {};
  Object.keys(geonames).forEach((w) => {
    if (w.search(" ") > -1) {
      const pre = w.substring(0, w.search(" "));
      if (!prefixes[pre]) {
        prefixes[pre] = [];
      }
      prefixes[pre].push(w);
    }
  });

  // first take out punctuation and lower, get all the individual words
  let words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s/);

  let matches = [];

  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    let match = null;

    // check for a single word match
    if (geonames.hasOwnProperty(w)) {
      match = w;
    }

    if (prefixes.hasOwnProperty(w)) {
      // if it is, check for each of those names in the succeeding string
      // and pick with the longest one

      let endWordInd = Math.min(
        words.length,
        i + Math.max(...prefixes[w].map((name) => name.split(/\s/).length)),
      );

      let succString = words.slice(i, endWordInd).join(" ");

      let possibleMatches = prefixes[w].filter(
        (m) => succString.indexOf(m) === 0,
      );

      if (possibleMatches.length > 0) {
        match = possibleMatches.sort(function (a, b) {
          return b.length - a.length;
        })[0];
      }
    }

    // convert into its id

    if (match !== null) {
      matches.push({ key: geonames[match], literal: match });
    }
  }

  return matches;
};
