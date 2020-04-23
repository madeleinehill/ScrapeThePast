import React, { useState } from "react";
import { connect } from "react-redux";
import { CREATE_DOCUMENTS } from "../modules/actions";
// import langcodes from "../utils/langcodes";
import { CloudUpload, Close, Description } from "@material-ui/icons";
import { createUseStyles } from "react-jss";
import sample from "../utils/sample.json";

const useStyles = createUseStyles({
  dropzoneContainer: {
    display: "flex",
    justifyContent: "center",
    margin: "8px",
    "& label:hover": {
      cursor: "pointer",
      backgroundColor: "#ccc",
    },
  },
  dropzone: {
    width: "100px",
    height: "70px",
    backgroundColor: "#eee",

    padding: "10px",
    display: "flex",
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center",
    flexWrap: "wrap",

    borderRadius: "5px",
    border: "dashed #999 2px",

    "& p": {
      margin: "3px !important",
    },
  },
  uploadContainer: {
    padding: "10px",
  },
  optionsContainer: {
    display: "flex",
    justifyContent: "center",
  },
  options: {
    width: "100%",
    maxWidth: "200px",
  },
  option: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: "20px",
    margin: "5px 0",
  },
  justifyRight: {
    marginTop: "15px",
    display: "flex",
    justifyContent: "flex-end",
  },
  button: {
    backgroundColor: "#3047C8",
    color: "#FFF",
    fontSize: "14px",
    cursor: "pointer",
  },
  imageContainer: {
    position: "relative",
    display: "inline-block",
    margin: "10px",
    width: "70px",
    height: "88px",
    "& button": {
      backgroundColor: "#000",
      color: "#FFF",
      position: "absolute",
      width: "20px",
      height: "20px",
      right: "-7px",
      top: "-7px",
      borderRadius: "10px",
      textAlign: "center",

      padding: 0,
      cursor: "pointer",
      "& :hover": {
        backgroundColor: "#555",
        borderRadius: "10px",
      },
    },
    "& .imgcont": {
      hidth: "70px",
      height: "70px",
      overflow: "hidden",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    "& .textcont": {
      maxWidth: "70px",
      display: "flex",
      justifyContent: "center",
      "& > span": {
        fontSize: "10px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
    },
  },
  imageDisplay: {
    overflowX: "scroll",
    maxHeight: "120px",
    display: "flex",
    flexWrap: "nowrap",
    backgroundColor: "#EEE",
  },
});

const Upload = (props) => {
  const classes = useStyles();

  const [uploads, setUploads] = useState([]);
  const [year, setYear] = useState("");
  const [lang, setLang] = useState("eng");

  const loadSample = () => {
    setUploads(
      sample.map((file) => ({
        url: file.url,
        file: new File([file.text], file.url, { type: "text/plain" }),
      })),
    );
  };

  const handleChange = (files) => {
    let uploadedFiles = files.map((file) => ({
      file: file,
      url: URL.createObjectURL(file),
    }));
    setUploads(uploadedFiles);
  };

  return (
    <div className={classes.uploadContainer}>
      <h2>Upload</h2>
      <div className={classes.dropzoneContainer}>
        {uploads.length === 0 && (
          <div style={{ maxWidth: "130px" }}>
            <label htmlFor="fileUploader" className={classes.dropzone}>
              <p></p>
              <CloudUpload fontSize="large" />
              <p>Upload Files (.txt or .jpg)</p>
            </label>
            <input
              style={{ display: "none" }}
              type="file"
              id="fileUploader"
              onChange={(e) => handleChange(Array.from(e.target.files))}
              multiple
            />
            <br></br>
            <span>OR </span>
            <button onClick={loadSample}>load sample</button>
          </div>
        )}
      </div>

      <div className={classes.imageDisplay}>
        {uploads.map((value, index) => {
          return (
            <div className={classes.imageContainer} key={`${index}`}>
              <div className={"imgcont"}>
                {value.file.type.indexOf("text") === 0 ? (
                  <Description style={{ fontSize: "50px" }} />
                ) : (
                  <img alt="upload preview" src={value.url} width="80px" />
                )}
              </div>

              <div className={"textcont"}>
                <span>{value.file.name}</span>
              </div>
              <button
                onClick={() =>
                  setUploads(uploads.filter((e, i) => i !== index))
                }
              >
                <Close style={{ fontSize: "17px" }} />
              </button>
            </div>
          );
        })}
      </div>

      <div className={classes.optionsContainer}>
        <div className={classes.options}>
          {/* <div className={classes.option}>
            <p>Language:</p>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              id="langsel"
              style={{ width: "137px !important" }}
            >
              {Object.keys(langcodes).map((key) => (
                <option value={key} key={key}>
                  {langcodes[key]}
                </option>
              ))}
            </select>
              </div> */}
          <div className={classes.option}>
            <p>Batch Year:</p>
            <input
              id="filled-number"
              size="small"
              type="number"
              placeholder="1900"
              onChange={(e) => setYear(e.target.value)}
            />
          </div>
          <div className={classes.justifyRight}>
            <button
              style={{
                width: "137px !important",
                color: "#FFF",
                backgroundColor: uploads.length ? undefined : "#aaa",
                cursor: uploads.length ? undefined : "default",
              }}
              className={classes.button}
              disabled={!uploads.length}
              onClick={() => {
                props.addDocumentsToStore({
                  uploads: uploads,
                  lang: lang,
                  year: year,
                });
                setUploads([]);
              }}
            >
              Analyze Documents
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  documents: state.documents,
});

const mapDispatchToProps = (dispatch) => ({
  addDocumentsToStore: (p) => dispatch({ type: CREATE_DOCUMENTS, payload: p }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Upload);
