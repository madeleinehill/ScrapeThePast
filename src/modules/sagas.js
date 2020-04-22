import { put, takeLatest, all, select } from "redux-saga/effects";
import {
  CREATE_DOCUMENTS,
  UPDATE_DOCUMENT,
  ADD_DOCUMENT,
} from "../modules/actions";

import geonames from "../utils/geonames";
import prefixes from "../utils/prefixes";

var Tesseract = window.Tesseract;

function geocodeText(text, blacklist) {
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

    if (
      match !== null &&
      Object.keys(blacklist).find((x) => x.toLowerCase() === match) ===
        undefined
    ) {
      matches.push({ key: geonames[match], literal: match });
    }
  }

  return matches;
}

function* load_image(u) {
  const img = new Image();
  img.src = yield new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.readAsDataURL(u);
    reader.onload = (event) => {
      resolve(event.target.result);
    };
  });

  const img_cp = yield new Promise((resolve, reject) => {
    img.onload = () => {
      resolve(img);
    };
  });
  return img_cp;
}

function* process_image_subset({ imgBlob, xRange, yRange }) {
  const img = yield load_image(imgBlob);

  xRange = !xRange ? [0, img.width] : xRange;
  yRange = !yRange ? [0, img.height] : yRange;

  const width = xRange[1] - xRange[0];
  const height = yRange[1] - yRange[0];

  const elem = yield document.createElement("canvas");

  elem.width = width;
  elem.height = height;

  const ctx = elem.getContext("2d");

  yield new Promise((resolve, reject) => {
    ctx.filter = "contrast(1.8)";
    resolve(ctx.drawImage(img, -xRange[0], -yRange[0], img.width, img.height));
  });

  const file = yield new Promise((resolve, reject) => {
    ctx.canvas.toBlob((blob) => {
      resolve(
        new File([blob], "resized", {
          type: "image/jpeg",
          lastModified: Date.now(),
        }),
      );
    });
  });

  return file;
}

// adapted from https://stackoverflow.com/questions/13405129/javascript-create-and-save-file
function downloadFile(file, filename = "download") {
  if (window.navigator.msSaveOrOpenBlob)
    // IE10+
    window.navigator.msSaveOrOpenBlob(file, filename);
  else {
    // Others
    var a = document.createElement("a"),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
}

function* runImage(u, lang) {
  const img = yield load_image(u.file);
  const verticalSliceHeight = 500;

  yield put({
    type: ADD_DOCUMENT,
    payload: {
      name: u.file.name,
      path: u.url.substring(5, u.url.length),
      text: "",
      confidence: 0,
      language: lang,
      geonames: [],
      loading: true,
      percentLoaded: 0,
    },
  });

  for (let j = 0; j < img.height; j += verticalSliceHeight) {
    console.log(`reading y slice [${j}, ${j + verticalSliceHeight}]`);

    const resized = yield process_image_subset({
      imgBlob: u.file,
      yRange: [j, j + verticalSliceHeight],
    });
    let result = yield Tesseract.recognize(resized, {
      tessedit_char_whitelist:
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.-",
      lang: lang,
    });

    let blacklist = yield select((state) => state.blacklist);

    yield put({
      type: UPDATE_DOCUMENT,
      payload: {
        path: u.url.substring(5, u.url.length),
        text: result.text,
        confidence: result.confidence,
        language: lang,
        geonames: geocodeText(result.text, blacklist),
        loading: j + verticalSliceHeight < img.height,
        percentLoaded: (j + verticalSliceHeight) / parseFloat(img.height),
      },
    });
  }
  return true;
}

// get text from text file
function* readText(u) {
  let r = null;
  const content = yield new Promise((resolve, error) => {
    r = new FileReader();
    r.onload = (e) => {
      resolve(e.target.result);
    };

    r.readAsText(u.file);
  });

  return content;
}

function* analyzeFiles(action) {
  console.log("action dispatched to saga", action);
  const { uploads } = action.payload;

  for (let i = 0; i < uploads.length; i++) {
    console.log(`reading file ${i + 1}/${uploads.length}`);

    const el = uploads[i];
    let type = el.file.type.substring(0, el.file.type.indexOf("/"));

    let blacklist = yield select((state) => state.blacklist);
    if (type === "image") {
      yield runImage(el, action.lang);
    } else if (type === "text") {
      const text = yield readText(el);

      yield put({
        type: ADD_DOCUMENT,
        payload: {
          name: el.file.name,
          path: el.url.substring(5, el.url.length),
          text: text,
          confidence: 100,
          language: action.lang,
          geonames: geocodeText(text, blacklist),
          loading: false,
        },
      });
    }
  }
}

function* actionWatcher() {
  yield takeLatest(CREATE_DOCUMENTS, analyzeFiles);
}

export default function* rootSaga() {
  yield all([actionWatcher()]);
}
