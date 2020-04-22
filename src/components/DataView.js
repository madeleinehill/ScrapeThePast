import React, { useState } from "react";
import { connect } from "react-redux";
import { ExpandMore, ExpandLess } from "@material-ui/icons";
import { createUseStyles } from "react-jss";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  CREATE_DOCUMENTS,
  DELETE_ITEM,
  TOGGLE_EXCLUDED_DOCUMENT,
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
      top: "-20px",
      right: "-25px",
      width: "80px",
      height: "20px",
      paddingTop: "2px",
      zIndex: "10",
      borderRadius: "5px",
      textAlign: "center",

      "&:before": {
        content: " ",
        display: "block",
        position: "absolute",
        top: "100%",
        left: "50%",
        marginLeft: "-5px",
        borderWidth: "5px",
        borderStyle: "solid",
        borderColor: "black transparent black transparent",
      },
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
          <div key={i}>
            <div className={classes.documentRow}>
              <div
                style={{
                  display: "flex",
                  flexWrap: "nowrap",
                  alignItems: "center",
                  height: "20px",
                }}
              >
                <input
                  type="checkbox"
                  checked={!documents[key].excluded}
                  onChange={() => props.toggleExclusion(key)}
                />
                <p>{documents[key].name}</p>
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
              {/* <p>Loading: {String(documents[key].loading)}</p> */}
            </div>
            <div
              style={{
                backgroundColor: "#EEE",
                height: expanded === key ? "auto" : "0",
                overflow: "hidden",
              }}
            >
              <p>Confidence: {documents[key].confidence}</p>
              <p>Full text: </p>
              <p>{documents[key].text}</p>
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
  removeItemFromStore: (p) => dispatch({ type: DELETE_ITEM, payload: p }),
});

export default connect(mapStateToProps, mapDispatchToProps)(DataView);
