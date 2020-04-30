import React, { useState } from "react";
import { connect } from "react-redux";
import { createUseStyles } from "react-jss";
import "react-circular-progressbar/dist/styles.css";
import { Close } from "@material-ui/icons";
import {
  ADD_TO_OVERRIDES,
  DELETE_FROM_OVERRIDES,
  SET_OVERRIDES,
  CLEAR_OVERRIDES,
} from "../modules/actions";

const useStyles = createUseStyles({
  dataViewContainer: {
    padding: "10px",
    paddingTop: "40px",
  },
  titleContainer: {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "40px",
    display: "flex",
    flexWrap: "noWrap",
    justifyContent: "space-between",
    alignItems: "center",
    "& > .title": {
      width: "100%",
      height: "40px",
      "& > h2": {
        margin: "10px",
      },
    },
    "& :hover": {
      cursor: "pointer",
      backgroundColor: "#EEE",
    },
  },
  documentTable: {
    margin: "10px 15px",
    borderTop: "solid 1px #F5F5F5",
    borderBottom: "solid 1px #F5F5F5",
    maxHeight: "190px",
    overflowY: "scroll",
    backgroundColor: "#EEE",
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
  clearButton: {
    backgroundColor: "#C83047",
    color: "#FFF",
    fontSize: "14px",
    cursor: "pointer",
    borderRadius: "0",
    marginRight: "5px",
    "&:hover": {
      backgroundColor: "#A82037",
    },
  },
});

const Overrides = (props) => {
  const classes = useStyles();
  const [assocToLiteral, setAssocToLiteral] = useState();
  const [assocFromLiteral, setAssocFromLiteral] = useState("");
  const [blacklistLiteral, setBlacklistLiteral] = useState("");
  const [whitelistLiteral, setWhitelistLiteral] = useState("");

  return (
    <div className={classes.dataViewContainer}>
      <div className={classes.titleContainer} onClick={props.setClose}>
        <div className="title">
          <h2>Overrides</h2>
        </div>
      </div>

      <span>Manual Phrases</span>
      <div className={classes.documentTable}>
        <div>
          <div className={classes.documentRow}>
            <input
              size="small"
              placeholder="phrase"
              value={assocFromLiteral}
              onChange={(e) => setAssocFromLiteral(e.target.value)}
              style={{ width: "90px" }}
            />
            <input
              size="small"
              placeholder="place"
              value={assocToLiteral}
              onChange={(e) => setAssocToLiteral(e.target.value)}
              style={{ width: "90px" }}
            />
            <button
              style={{ marginRight: "20px" }}
              disabled={!assocFromLiteral || !assocToLiteral}
              onClick={() => {
                props.addToAssociations(
                  assocFromLiteral
                    .toLowerCase()
                    .trim()
                    .replace(/[^a-z ]/g, ""),
                  assocToLiteral
                    .toLowerCase()
                    .trim()
                    .replace(/[^a-z ]/g, ""),
                );
                setAssocFromLiteral("");
                setAssocToLiteral("");
              }}
            >
              add
            </button>
          </div>
        </div>
        {Object.keys(props.associations).map((key, i) => (
          <div key={i}>
            <div className={classes.documentRow}>
              <span>
                {key} -> {props.associations[key]}
              </span>
              <button
                className={classes.deleteButton}
                onClick={() => props.deleteFromAssociations(key)}
              >
                <Close style={{ fontSize: "14px" }} />
                <span className={"hide"}>remove</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          margin: "10px",
          marginTop: "0",
        }}
      >
        <p style={{ display: "inline-block", margin: "0" }}>
          Use alternate names
        </p>
        <input
          type="checkbox"
          checked={props.options.useAlternateNames}
          onChange={(e) => props.toggleAlternateNames(e.target.checked)}
          style={{ display: "inline-block" }}
        />
      </div>
      <span>Blacklist</span>
      <div className={classes.documentTable}>
        <div>
          <div className={classes.documentRow}>
            <input
              size="small"
              placeholder="+add phrase"
              value={blacklistLiteral}
              onChange={(e) => setBlacklistLiteral(e.target.value)}
              style={{ width: "180px" }}
            />
            <button
              style={{ marginRight: "20px" }}
              disabled={!blacklistLiteral}
              onClick={() => {
                props.addToBlacklist(
                  blacklistLiteral
                    .toLowerCase()
                    .trim()
                    .replace(/[^a-z ]/g, ""),
                );
                setBlacklistLiteral("");
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
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Whitelist</span>
        <div style={{ display: "inline-block", marginRight: "10px" }}>
          <p style={{ display: "inline-block", margin: "0" }}>enabled</p>{" "}
          <input
            type="checkbox"
            checked={props.options.useWhitelist}
            onChange={(e) => props.toggleWhitelist(e.target.checked)}
            style={{ display: "inline-block" }}
          />
        </div>
      </div>
      <div className={classes.documentTable}>
        <div>
          <div className={classes.documentRow}>
            <input
              size="small"
              placeholder="+add phrase"
              value={whitelistLiteral}
              onChange={(e) => setWhitelistLiteral(e.target.value)}
              style={{ width: "180px" }}
            />
            <button
              style={{ marginRight: "20px" }}
              disabled={!whitelistLiteral}
              onClick={() => {
                props.addToWhitelist(
                  whitelistLiteral
                    .toLowerCase()
                    .trim()
                    .replace(/[^a-z ]/g, ""),
                );
                setWhitelistLiteral("");
              }}
            >
              add
            </button>
          </div>
        </div>
        {Object.keys(props.whitelist).map((key, i) => (
          <div key={i}>
            <div className={classes.documentRow}>
              <span>{key}</span>
              <button
                className={classes.deleteButton}
                onClick={() => props.deleteFromWhitelist(key)}
              >
                <Close style={{ fontSize: "14px" }} />
                <span className={"hide"}>remove</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      <div
        style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}
      >
        <button className={classes.clearButton} onClick={props.clearWhitelist}>
          Clear Whitelist
        </button>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  blacklist: state.overrides.blacklist,
  associations: state.overrides.associations,
  whitelist: state.overrides.whitelist,
  options: state.overrides.options,
});

const mapDispatchToProps = (dispatch) => ({
  addToBlacklist: (literal) =>
    dispatch({
      type: ADD_TO_OVERRIDES,
      payload: {
        attribute: "blacklist",
        override: { literal: literal },
      },
    }),
  deleteFromBlacklist: (literal) =>
    dispatch({
      type: DELETE_FROM_OVERRIDES,
      payload: {
        attribute: "blacklist",
        override: { literal: literal },
      },
    }),
  addToWhitelist: (fromLiteral) =>
    dispatch({
      type: ADD_TO_OVERRIDES,
      payload: {
        attribute: "whitelist",
        override: { literal: fromLiteral },
      },
    }),
  deleteFromWhitelist: (fromLiteral) =>
    dispatch({
      type: DELETE_FROM_OVERRIDES,

      payload: {
        attribute: "whitelist",
        override: { literal: fromLiteral },
      },
    }),
  addToAssociations: (fromLiteral, toLiteral) =>
    dispatch({
      type: ADD_TO_OVERRIDES,
      payload: {
        attribute: "association",
        override: { fromLiteral: fromLiteral, toLiteral: toLiteral },
      },
    }),
  deleteFromAssociations: (fromLiteral) =>
    dispatch({
      type: DELETE_FROM_OVERRIDES,

      payload: {
        attribute: "association",
        override: { fromLiteral: fromLiteral },
      },
    }),
  toggleWhitelist: (value) =>
    dispatch({
      type: SET_OVERRIDES,

      payload: {
        attribute: "useWhitelist",
        value: value,
      },
    }),
  toggleAlternateNames: (value) =>
    dispatch({
      type: SET_OVERRIDES,

      payload: {
        attribute: "useAlternateNames",
        value: value,
      },
    }),
  clearWhitelist: () =>
    dispatch({
      type: CLEAR_OVERRIDES,

      payload: {
        attribute: "whitelist",
      },
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Overrides);
