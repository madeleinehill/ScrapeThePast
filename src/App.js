import React from "react";
import { Provider } from "react-redux";

import { createUseStyles } from "react-jss";
import SplitPane from "react-split-pane";
import Pane from "react-split-pane/lib/Pane";

import configureStore from "./modules/store";
import Sidebar from "./components/Sidebar";
import Map from "./components/Map";

const reduxStore = configureStore();

const useStyles = createUseStyles({
  "@global": {
    body: {
      margin: 0,
      height: "100vh",
      width: "100vw",
      position: "fixed",
      overflow: "hidden",
      top: "0",
      left: "0",
    },
  },

  SplitPaneDisplay: {
    height: "100vh",
    width: "100vw",
    "& .Resizer": {
      background: "#000",
      opacity: "0.2",
      zIndex: "1",
      boxSizing: "border-box",
      mozBackgroundClip: "padding",
      webkitBackgroundClip: "padding",
      backgroundClip: "padding-box",

      "& :hover": {
        webkitTransition: "all 2s ease",
        transition: "all 2s ease",
      },
    },
    "& .horizontal": {
      height: "11px",
      margin: "-5px 0",
      borderTop: "5px solid rgba(255, 255, 255, 0)",
      borderBottom: "5px solid rgba(255, 255, 255, 0)",
      width: "100%",
      cursor: "row-resize",

      "&:hover": {
        borderTop: "5px solid rgba(0, 0, 0, 0.5)",
        borderBottom: "5px solid rgba(0, 0, 0, 0.5)",
      },
    },
    "& .vertical": {
      width: "11px",
      margin: "0 -5px",
      borderLeft: "5px solid rgba(255, 255, 255, 0)",
      borderRight: "5px solid rgba(255, 255, 255, 0)",
      cursor: "col-resize",
      "&:hover": {
        borderLeft: "5px solid rgba(0, 0, 0, 0.5)",
        borderRight: "5px solid rgba(0, 0, 0, 0.5)",
      },
    },
    "& .disabled": {
      cursor: "not-allowed",
      "& :hover": {
        borderColor: "transparent",
      },
    },
  },
});

function App() {
  const classes = useStyles();
  return (
    <Provider store={reduxStore}>
      <SplitPane
        split="vertical"
        minSize={250}
        className={classes.SplitPaneDisplay}
      >
        <Pane initialSize="300px">
          <Sidebar />
        </Pane>
        <Pane>
          <Map />
        </Pane>
      </SplitPane>
    </Provider>
  );
}

export default App;
