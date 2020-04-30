import React, { useState } from "react";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  pane: {
    overflowY: "auto",
    border: "solid 1px #E8E8E8",
    width: "100%",
    position: "relative",
    flex: "1 1 0",
  },
  accordion: {
    position: "relative",
    display: "flex",
    width: "100%",
    flex: "1 1 0",
    flexWrap: "wrap",
    alignItems: "start",
    flexDirection: "column",
    justifyContent: "flex-start",
    overflow: "hidden",
    marginBottom: "30px",
  },
});

const Accordion = (props) => {
  const classes = useStyles();
  const [open, setOpen] = useState(0);

  const setClose = () => setOpen(null);

  return (
    <div className={classes.accordion}>
      {props.children.map((c, i) => (
        <div
          key={i}
          className={classes.pane}
          style={{
            maxHeight: open === i ? undefined : "40px",
            overflowY: open === i ? "auto" : "hidden",
          }}
          onClick={
            open === i
              ? () => null
              : () => {
                  setOpen(i);
                }
          }
        >
          {React.cloneElement(c, { setClose: setClose })}
        </div>
      ))}
    </div>
  );
};

export default Accordion;
