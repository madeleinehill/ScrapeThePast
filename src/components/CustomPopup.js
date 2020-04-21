import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

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
      <p> Number of mentions: {props.data.mentions}</p>
      <p> Name used: </p>
      <ul>
        {Object.keys(props.data.literals)
          .sort(
            (a, b) =>
              props.data.literals[a].count - props.data.literals[b].count,
          )
          .map((l) => (
            <li key={l}>
              ({props.data.literals[l].count}) {l}
            </li>
          ))}
      </ul>

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
