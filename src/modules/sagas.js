import { put, takeLatest, all, select } from "redux-saga/effects";
import {
  CREATE_DOCUMENTS,
  UPDATE_DOCUMENT,
  ADD_DOCUMENT,
} from "../modules/actions";

var Tesseract = window.Tesseract;

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

function* runImage(u, lang, year) {
  const img = yield load_image(u.file);
  const verticalSliceHeight = 500;

  yield put({
    type: ADD_DOCUMENT,
    year: year,
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
    const resized = yield process_image_subset({
      imgBlob: u.file,
      yRange: [j, j + verticalSliceHeight],
    });
    let result = yield Tesseract.recognize(resized, {
      tessedit_char_whitelist:
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.-",
      lang: lang,
    });

    yield put({
      type: UPDATE_DOCUMENT,
      payload: {
        path: u.url.substring(5, u.url.length),
        text: result.text,
        confidence: result.confidence,
        language: lang,
        geonames: [],
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
  const { uploads } = action.payload;

  for (let i = 0; i < uploads.length; i++) {
    const el = uploads[i];
    let type = el.file.type.substring(0, el.file.type.indexOf("/"));

    // if a year is not specified, see if it is in the filename
    let year = action.payload.year;
    if (
      !year &&
      el.file.name.length > 4 &&
      el.file.name.substring(4, 5) === "_" &&
      parseInt(el.file.name.substring(0, 4))
    ) {
      year = parseInt(el.file.name.substring(0, 4));
    }

    if (type === "image") {
      yield runImage(el, action.lang, year);
    } else if (type === "text") {
      const text = yield readText(el);

      yield put({
        type: ADD_DOCUMENT,
        payload: {
          name: el.file.name,
          year: year,
          path: el.url.substring(5, el.url.length),
          text: text,
          confidence: 100,
          language: action.lang,
          geonames: [],
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
