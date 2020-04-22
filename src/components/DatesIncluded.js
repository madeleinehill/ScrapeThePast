import React, { useState } from "react";
import { connect } from "react-redux";
import { SET_FILTER_FUNCTION } from "../modules/actions";
import { createUseStyles } from "react-jss";
import InputRange from "react-input-range";
import "react-input-range/lib/css/index.css";

const useStyles = createUseStyles({
  paneContainer: {
    padding: "10px",
    "& .input-range__slider": {
      transition: "none !important",
    },
    "& .input-range__slider-container": {
      transition: "none !important",
    },
    "& .input-range__track, .input-range__track--active": {
      transition: "none !important",
    },
  },
  button: {
    backgroundColor: "#3047C8",
    color: "#FFF",
    fontSize: "14px",
    cursor: "pointer",
  },
  rangeContainer: {
    margin: "25px 35px",
  },
  optionsContainer: {
    display: "flex",
    justifyContent: "center",
  },
  options: {
    width: "100%",
    maxWidth: "300px",
    margin: "0px 20px",
  },
  option: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: "20px",
    margin: "5px 0",
  },
});

const Dates = (props) => {
  const classes = useStyles();
  const [includeND, setIncludeND] = useState(true);

  const sortedDocs = Object.values(props.documents)
    .filter((d) => !!d.year)
    .sort((a, b) => a.year - b.year);

  const docsRange =
    sortedDocs.length > 0 &&
    sortedDocs[0].year < sortedDocs[sortedDocs.length - 1].year
      ? [sortedDocs[0].year, sortedDocs[sortedDocs.length - 1].year]
      : [1800, 2000];

  const [yearRange, setYearRange] = useState({
    min: docsRange[0],
    max: docsRange[1],
  });

  const [userSet, recordUserSet] = useState(false);

  const handleChange = (value) => {
    setYearRange(value);
    recordUserSet(true);
    props.setFilterFunction(
      (year) =>
        (includeND && !year) || (year >= value.min && year <= value.max),
    );
  };

  return (
    <div className={classes.paneContainer}>
      <h2>Map Controls</h2>
      <p style={{ margin: "10px" }}>Dates Included</p>
      <div className={classes.rangeContainer}>
        <InputRange
          allowSameValues={true}
          draggableTrack={true}
          minValue={docsRange[0]}
          maxValue={docsRange[1]}
          value={{
            min: Math.max(yearRange.min, docsRange[0]),
            max: Math.min(yearRange.max, docsRange[1]),
          }}
          disabled={
            !(
              sortedDocs.length > 0 &&
              sortedDocs[0].year < sortedDocs[sortedDocs.length - 1].year
            )
          }
          onChange={handleChange}
        />
      </div>
      <div className={classes.optionsContainer}>
        <div className={classes.options}>
          <div className={classes.option}>
            <p>Include no-date docs:</p>
            <input
              type="checkbox"
              checked={includeND}
              onChange={() => {
                setIncludeND(!includeND);
                handleChange(yearRange);
              }}
            />
          </div>
          <div className={classes.option}>
            <p>Use relative sizing:</p>
            <input
              type="checkbox"
              checked={includeND}
              onChange={() => {
                setIncludeND(!includeND);
                handleChange(yearRange);
              }}
            />
          </div>
          <div className={classes.option}>
            <p>Scale markers:</p>
            <input
              type="checkbox"
              checked={includeND}
              onChange={() => {
                setIncludeND(!includeND);
                handleChange(yearRange);
              }}
            />
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
  setFilterFunction: (p) => dispatch({ type: SET_FILTER_FUNCTION, payload: p }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dates);
