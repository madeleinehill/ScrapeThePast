import React from "react";
import SplitPane from "react-split-pane";
import Pane from "react-split-pane/lib/Pane";
import Upload from "./Upload";
import DataView from "./DataView";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  centerContentVertical: {
    display: "flex",
    alignItems: "center",
    position: "relative",
  },
  sidebar: {
    overflowY: "auto !important",
    height: "100vh",
    minWidth: "250px",
    "& h2": {
      fontFamily: "Red Hat Text",
      fontWeight: "normal",
      fontSize: "20px",
      margin: "0",
    },
    "& h3": {
      fontFamily: "Roboto",
      fontWeight: "normal",
      fontSize: "14px",
      color: "#393939",
      margin: "0",
    },
    "& p, span": {
      fontSize: "14px",
      fontFamily: "Roboto",
    },
    "& button": {
      fontSize: "14px",
      fontFamily: "Roboto",
    },
  },
  pane: {
    overflowY: "auto",
    maxHeight: "60vh",
  },
});

const Sidebar = (props) => {
  const classes = useStyles();
  return (
    <div style={{ position: "relative" }} className={classes.sidebar}>
      <SplitPane split="horizontal">
        <Pane
          maxSize={"80px"}
          minSize={"80px"}
          initialSize="80px"
          className={classes.centerContentVertical}
        >
          <img
            alt="scrape the past"
            src={process.env.PUBLIC_URL + "/logo.svg"}
          ></img>
        </Pane>
        <Pane className={classes.pane} initialSize="200px" minSize={"80px"}>
          <Upload />
        </Pane>
        <Pane
          className={classes.pane}
          minSize={"80px"}
          maxSize={"300px"}
          initialSize="240px"
        >
          <DataView />
        </Pane>
        <Pane minSize={"30px"} className={classes.centerContentVertical}>
          <p
            style={{
              position: "absolute",
              bottom: "0",
              left: "0",
              margin: "10px",
              fontSize: "10px",
            }}
          >
            This website was created by Henry Hill for educational purposes. You
            can find the source on Github{" "}
            <a
              target="_blank"
              href="https://github.com/henryhill1999/ScrapeThePast"
            >
              here
            </a>
          </p>
        </Pane>
      </SplitPane>
    </div>
  );
};

export default Sidebar;
