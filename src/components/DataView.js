import React, { useState } from "react";
import { connect } from "react-redux";
import { ExpandMore, ExpandLess } from "@material-ui/icons";
import { createUseStyles } from "react-jss";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  CREATE_DOCUMENTS,
  DELETE_DOCUMENT,
  TOGGLE_EXCLUDED_DOCUMENT,
  SET_DOCUMENT_YEAR,
} from "../modules/actions";

const useStyles = createUseStyles({
  dataViewContainer: {
    padding: "10px",
  },
  titleContainer: {
    display: "flex",
    flexWrap: "noWrap",
    justifyContent: "space-between",
    alignItems: "center",
  },
  documentTable: {
    margin: "10px 15px",
    borderTop: "solid 1px #F5F5F5",
    borderBottom: "solid 1px #F5F5F5",
  },
  expandedView: {
    position: "relative",
    backgroundColor: "#EEE",
    overflow: "hidden",
  },
  deleteButton: {
    backgroundColor: "#C83047",
    color: "#FFF",
    fontSize: "14px",
    cursor: "pointer",
    borderRadius: "0",
    "&:hover": {
      backgroundColor: "#A82037",
    },
  },
  option: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  },
  documentRow: {
    position: "relative",
    display: "flex",
    flexWrap: "noWrap",
    justifyContent: "space-between",
    alignItems: "center",
    "&:hover": {
      border: "solid 1px #CCC",
      backgroundColor: "#EEE",

      "& button": {
        border: "solid 1px #666",
        boxShadow: "inset 0 0 2px #00000088",
      },
    },

    "& .hide": {
      backgroundColor: "#333",
      color: "#FFF",
      visibility: "hidden",
      position: "absolute",
      top: "-25px",
      right: "-25px",
      width: "80px",
      height: "20px",
      paddingTop: "2px",
      zIndex: "10",
      borderRadius: "5px",
      textAlign: "center",
    },
    "& p": {
      margin: "5px 0",
    },
    "& button": {
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      width: "24px",
      height: "24px",
      padding: "0",
      outline: "none",

      "&:hover": {
        backgroundColor: "#3047C8",
        color: "#FFF",
        "& > .hide": {
          visibility: "visible",
        },
      },
    },
  },
});

const DataView = (props) => {
  const { documents } = props;
  const classes = useStyles();
  const [expanded, setExpanded] = useState("");
  const [showFull, setShowFull] = useState(false);

  return (
    <div className={classes.dataViewContainer}>
      <div className={classes.titleContainer}>
        <h2>Documents</h2>
        <h3>
          ({Object.keys(documents).length} document{!documents.length && "s"})
        </h3>
      </div>
      <div className={classes.documentTable}>
        {Object.keys(documents).map((key, i) => (
          <div
            key={i}
            style={{ border: expanded === key ? "solid 1px #888" : "none" }}
          >
            <div className={classes.documentRow}>
              <div
                style={{
                  display: "flex",
                  flexWrap: "nowrap",
                  alignItems: "center",
                  height: "20px",
                  maxWidth: "95%",
                }}
              >
                <input
                  type="checkbox"
                  checked={!documents[key].excluded}
                  onChange={() => props.toggleExclusion(key)}
                />
                <p
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {documents[key].name}
                </p>
              </div>
              {documents[key].loading ? (
                <div style={{ maxWidth: "20px" }}>
                  <CircularProgressbar
                    value={documents[key].percentLoaded * 100 + 1}
                    strokeWidth={50}
                    styles={buildStyles({
                      strokeLinecap: "butt",
                    })}
                  />
                </div>
              ) : (
                <button
                  onClick={() => setExpanded(expanded === key ? "" : key)}
                >
                  {expanded === key ? <ExpandLess /> : <ExpandMore />}
                  <span className={"hide"}>more info</span>
                </button>
              )}
            </div>
            <div
              className={classes.expandedView}
              style={{
                height: expanded === key ? "auto" : "0",
                padding: expanded === key ? "10px" : "0",
              }}
            >
              <div className={classes.option}>
                <span style={{ fontWeight: "bold" }}>Year:</span>{" "}
                <input
                  id="filled-number"
                  size="small"
                  type="number"
                  value={documents[key].year}
                  placeholder="none"
                  onChange={(e) => props.setDocumentYear(key, e.target.value)}
                />
              </div>
              <div className={classes.option}>
                <span style={{ fontWeight: "bold" }}>Confidence:</span>{" "}
                <span>{documents[key].confidence}%</span>
              </div>
              <div
                className={classes.option}
                style={{
                  marginBottom: "0",
                }}
              >
                <span style={{ fontWeight: "bold" }}>Text: </span>{" "}
                <button onClick={() => setShowFull(!showFull)}>
                  {showFull ? "hide" : "show"} full text
                </button>
              </div>
              <p
                style={{
                  marginTop: "5px",
                  padding: "5px",
                  backgroundColor: "#FFF",
                  height: showFull ? "auto" : "35px",
                  overflow: "hidden",
                  transition: "height 0.2s",
                }}
              >
                {documents[key].text}
              </p>
              <p>
                <button
                  className={classes.deleteButton}
                  onClick={() => props.removeItemFromStore(key)}
                >
                  Delete Document
                </button>
              </p>
            </div>{" "}
          </div>
        ))}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  documents: state.documents,
});

const mapDispatchToProps = (dispatch) => ({
  addItemToStore: (p) => dispatch({ type: CREATE_DOCUMENTS, payload: p }),
  toggleExclusion: (url) =>
    dispatch({ type: TOGGLE_EXCLUDED_DOCUMENT, payload: url }),
  removeItemFromStore: (p) => dispatch({ type: DELETE_DOCUMENT, payload: p }),
  setDocumentYear: (key, year) =>
    dispatch({ type: SET_DOCUMENT_YEAR, payload: { key: key, year: year } }),
});

export default connect(mapStateToProps, mapDispatchToProps)(DataView);
