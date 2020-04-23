import React, { useState } from "react";
import { connect } from "react-redux";
import { createUseStyles } from "react-jss";
import "react-circular-progressbar/dist/styles.css";
import { Close } from "@material-ui/icons";
import {
  ADD_TO_BLACKLIST,
  DELETE_FROM_BLACKLIST,
  ADD_TO_SUBSTITUTIONS,
  DELETE_FROM_SUBSTITUTIONS,
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
    maxHeight: "70px",
    overflowY: "scroll",
  },
  deleteButton: {
    position: "relative",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    width: "16px",
    height: "16px",
    padding: "0",
    outline: "none",
    marginRight: "16px",

    "&:hover": {
      backgroundColor: "#3047C8",
      color: "#FFF",
      "& > .hide": {
        visibility: "visible",
      },
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
    height: "25px",
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
      top: "-5px",
      right: "20px",
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
  },
});

const Overrides = (props) => {
  const classes = useStyles();
  const [literal, setLiteral] = useState("");
  const [toLiteral, setToLiteral] = useState("");
  const [fromLiteral, setFromLiteral] = useState("");

  return (
    <div className={classes.dataViewContainer}>
      <div className={classes.titleContainer}>
        <h2>Overrides</h2>
      </div>
      <span>Blacklist</span>
      <div className={classes.documentTable}>
        <div>
          <div className={classes.documentRow}>
            <input
              size="small"
              placeholder="+add phrase"
              value={literal}
              onChange={(e) => setLiteral(e.target.value)}
              style={{ width: "180px" }}
            />
            <button
              style={{ marginRight: "20px" }}
              disabled={!literal}
              onClick={() => {
                props.addToBlacklist(literal.toLowerCase().trim());
                setLiteral("");
              }}
            >
              add
            </button>
          </div>
        </div>
        {Object.keys(props.blacklist).map((key, i) => (
          <div key={i}>
            <div className={classes.documentRow}>
              <span>{key}</span>
              <button
                className={classes.deleteButton}
                onClick={() => props.deleteFromBlacklist(key)}
              >
                <Close style={{ fontSize: "14px" }} />
                <span className={"hide"}>remove</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      <span>Re-Associations</span>
      <div className={classes.documentTable}>
        <div>
          <div className={classes.documentRow}>
            <input
              size="small"
              placeholder="from"
              value={fromLiteral}
              onChange={(e) => setFromLiteral(e.target.value)}
              style={{ width: "90px" }}
            />
            <input
              size="small"
              placeholder="to"
              value={toLiteral}
              onChange={(e) => setToLiteral(e.target.value)}
              style={{ width: "90px" }}
            />
            <button
              style={{ marginRight: "20px" }}
              disabled={!fromLiteral || !toLiteral}
              onClick={() => {
                props.addToSubstitutions(
                  fromLiteral.toLowerCase().trim(),
                  toLiteral.toLowerCase().trim(),
                );
                setFromLiteral("");
                setToLiteral("");
              }}
            >
              add
            </button>
          </div>
        </div>
        {Object.keys(props.substitutions).map((key, i) => (
          <div key={i}>
            <div className={classes.documentRow}>
              <span>
                {key} -> {props.substitutions[key]}
              </span>
              <button
                className={classes.deleteButton}
                onClick={() => props.deleteFromSubstitutions(key)}
              >
                <Close style={{ fontSize: "14px" }} />
                <span className={"hide"}>remove</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  blacklist: state.blacklist,
  substitutions: state.substitutions,
});

const mapDispatchToProps = (dispatch) => ({
  addToBlacklist: (literal) =>
    dispatch({ type: ADD_TO_BLACKLIST, payload: { literal: literal } }),
  deleteFromBlacklist: (literal) =>
    dispatch({ type: DELETE_FROM_BLACKLIST, payload: { literal: literal } }),
  addToSubstitutions: (fromLiteral, toLiteral) =>
    dispatch({
      type: ADD_TO_SUBSTITUTIONS,
      payload: { fromLiteral: fromLiteral, toLiteral: toLiteral },
    }),
  deleteFromSubstitutions: (fromLiteral) =>
    dispatch({
      type: DELETE_FROM_SUBSTITUTIONS,
      payload: { literal: fromLiteral },
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Overrides);
