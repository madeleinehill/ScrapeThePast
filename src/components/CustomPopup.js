import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  card: {
    minWidth: 220,
    "& h3, p, li ": {
      marginTop: "3px",
      marginBottom: "3px",
    },
  },
});

const CustomPopup = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.card}>
      <h3>
        {props.data.name +
          (props.data.type === "city" ? `, ${props.data.admin_code}` : "")}
      </h3>
      <p>
        {" "}
        Number of mentions: {props.data.mentions} (
        {((100 * props.data.mentions) / props.data.totalMentions).toFixed(1)}%
        of all)
      </p>
      <p> Name used: </p>
      <div
        style={{
          backgroundColor: "#EEE",
          maxHeight: "190px",
          overflowY: "auto",
        }}
      >
        <ul>
          {Object.keys(props.data.literals)
            .sort(
              (a, b) =>
                props.data.literals[b].count - props.data.literals[a].count,
            )
            .map((l) => (
              <li key={l}>
                {l} ({props.data.literals[l].count} times)
              </li>
            ))}
        </ul>
      </div>

      {props.data.population && <p> Population: {props.data.population}</p>}
      <p>
        Lat/lng: {props.data.latitude}/{props.data.longitude}
      </p>
      {props.data.population && <p> Population: {props.data.population}</p>}
      {props.data.admin_code && <p> State/province: {props.data.admin_code}</p>}
      <p>Country: {props.data.country_code}</p>
    </div>
  );
};
export default CustomPopup;
