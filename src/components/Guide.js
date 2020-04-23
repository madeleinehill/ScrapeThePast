import React, { useState } from "react";
import { connect } from "react-redux";
import { SET_FILTER_FUNCTION, SET_MAP_CONTROL } from "../modules/actions";
import { ArrowLeft, ArrowRight } from "@material-ui/icons";
import { createUseStyles } from "react-jss";
import content from "../utils/content";
const useStyles = createUseStyles({
  container: {
    position: "absolute",
    right: "20px",
    bottom: "20px",
    maxWidth: "400px",
    zIndex: "1000",
  },
  toggleIcon: {
    width: "100px",
    height: "100px",
    float: "right",
    cursor: "pointer",
  },
  contentCard: {
    minWidth: "250px",
    backgroundColor: "#FFF",
    borderRadius: "10px",
    padding: "15px",
    paddingBottom: "33px",
    boxShadow: "0 3px 14px rgba(0,0,0,0.4)",
    "& p": {
      fontSize: "14px",
      lineHeight: "20px",
    },
  },
  arrowContainer: {
    display: "flex",
    alignItems: "center",
    float: "right",
    fontSize: "12px",
    "& button": {
      width: "25px",
      height: "25px",
      padding: "0",
      borderRadius: "5px",
      cursor: "pointer",
      "&:disabled": {
        backgroundColor: "#DDD",
        color: "#333",
        cursor: "default",
      },
    },
  },
});

const Guide = (props) => {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const [navIndex, setNavIndex] = useState(0);

  return (
    <div className={classes.container}>
      {open && (
        <div className={classes.contentCard}>
          <h2>{content[navIndex].title}</h2>
          <p
            dangerouslySetInnerHTML={{
              __html: content[navIndex].text,
            }}
          ></p>
          <div className={classes.arrowContainer}>
            <span style={{ margin: "7px", color: "#333" }}>
              ({navIndex + 1}/{Object.keys(content).length})
            </span>
            <button
              disabled={navIndex === 0}
              onClick={() => setNavIndex(navIndex - 1)}
            >
              <ArrowLeft />
            </button>
            <button
              disabled={navIndex === content.length - 1}
              onClick={() => setNavIndex(navIndex + 1)}
            >
              <ArrowRight />
            </button>
          </div>
        </div>
      )}
      <img
        alt="toggle guide"
        src={
          process.env.PUBLIC_URL +
          (open ? "/book_open.svg" : "/book_closed.svg")
        }
        style={open ? {} : { width: "40px", marginRight: "10px" }}
        className={classes.toggleIcon}
        onClick={() => setOpen(!open)}
      ></img>
    </div>
  );
};

const mapStateToProps = (state) => ({
  documents: state.documents,
  relativeSizing: state.mapControls.relativeSizing,
  scaleMarkers: state.mapControls.scaleMarkers,
  threshold: state.mapControls.threshold,
  groupByState: state.mapControls.groupByState,
});

const mapDispatchToProps = (dispatch) => ({
  setFilterFunction: (p) => dispatch({ type: SET_FILTER_FUNCTION, payload: p }),
  setMapControl: (p) => dispatch({ type: SET_MAP_CONTROL, payload: p }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Guide);
