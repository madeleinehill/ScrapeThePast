import React from "react";
import Upload from "./Upload";
import DataView from "./DataView";
import MapControls from "./MapControls";
import Overrides from "./Overrides";
import Accordion from "./Accordion";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  centerContentVertical: {
    display: "flex",
    alignItems: "center",
    position: "relative",
  },
  sidebar: {
    height: "100vh",
    minWidth: "250px",
    position: "relative",
    paddingBottom: "25px",
    display: "flex",
    flexDirection: "column",
  },
  pane: {
    overflowY: "auto",
  },
  break: {
    flexBasis: "100%",
    height: "0",
  },
});

const Sidebar = (props) => {
  const classes = useStyles();

  return (
    <>
      <div className={classes.sidebar}>
        <div
          style={{ height: "80px", width: "100%", flex: "0 0 80px " }}
          className={classes.centerContentVertical}
        >
          <img
            alt="scrape the past"
            src={process.env.PUBLIC_URL + "/logo.svg"}
          ></img>
        </div>
        <Accordion>
          <Upload />
          <DataView />
          <MapControls />
          <Overrides />
        </Accordion>
      </div>
      <p
        style={{
          position: "absolute",
          bottom: "0",
          left: "0",
          margin: "4px",
          fontSize: "10px",
        }}
      >
        This website was created by{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.henryjhill.com/projects"
        >
          Henry Hill
        </a>
        . <br></br>You can find the source on Github{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/henryhill1999/ScrapeThePast"
        >
          here
        </a>
      </p>
    </>
  );
};

export default Sidebar;
