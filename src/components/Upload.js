import React, { useState } from "react";
import { connect } from "react-redux";
import { CREATE_DOCUMENTS } from "../modules/actions";
import langcodes from "../utils/langcodes";
import { Button, TextField, Select } from "@material-ui/core";
import { CloudUpload, Close, Description } from "@material-ui/icons";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  dropzoneContainer: {
    display: "flex",
    justifyContent: "center",
    margin: "8px",
    "& :hover": {
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
    "& div": {
      maxWidth: "70px",
      maxHeight: "70px",
      overflow: "hidden",
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
  const [lang, setLang] = useState("eng");

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
          <>
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
          </>
        )}
      </div>
      <div className={classes.imageDisplay}>
        {uploads.map((value, index) => {
          return (
            <div className={classes.imageContainer} key={`${index}`}>
              <div>
                {value.file.type.indexOf("text") === 0 ? (
                  <Description style={{ fontSize: "60px" }} />
                ) : (
                  <img alt="upload preview" src={value.url} width="100px" />
                )}
              </div>
              <button
                onClick={() =>
                  setUploads(uploads.filter((e, i) => i !== index))
                }
              >
                <Close style={{ fontSize: "15px" }} />
              </button>
            </div>
          );
        })}
      </div>
      <div className={classes.optionsContainer}>
        <p>Language</p>
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
      </div>
      <div className={classes.optionsContainer}>
        <p>Year</p>
        <input id="filled-number" size="small" type="number" />
      </div>
      <div className={classes.justifyRight}>
        <button
          style={{
            width: "137px !important",
            backgroundColor: uploads.length ? undefined : "#999",
            cursor: uploads.length ? undefined : "default",
          }}
          className={classes.button}
          disabled={!uploads.length}
          onClick={() => {
            props.addDocumentsToStore({ uploads: uploads, lang: lang });
            setUploads([]);
          }}
        >
          Analyze Documents
        </button>
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
