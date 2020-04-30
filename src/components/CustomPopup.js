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
  const {
    type,
    admin_code,
    name,
    mentions,
    totalMentions,
    literals,
    population,
    latitude,
    longitude,
    country_code,
  } = props.data;
  const classes = useStyles();

  const code =
    type === "city"
      ? `, ${country_code === "US" ? admin_code : country_code}`
      : "";

  return (
    <div className={classes.card}>
      <h2>{name + code}</h2>
      <p>
        {" "}
        Number of mentions: {mentions} (
        {((100 * mentions) / totalMentions).toFixed(1)}% of all)
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
          {Object.keys(literals)
            .sort((a, b) => literals[b].count - literals[a].count)
            .map((l) => (
              <li key={l}>
                {l} ({literals[l].count} times)
              </li>
            ))}
        </ul>
      </div>

      {population && <p> Population: {population}</p>}
      <p>
        Lat/lng: {latitude}/{longitude}
      </p>
      {population && <p> Population: {population}</p>}
      {admin_code && <p> State/province: {admin_code}</p>}
      <p>Country: {country_code}</p>
    </div>
  );
};
export default CustomPopup;
