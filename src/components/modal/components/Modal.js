import React from "react";
import { Icon } from "../../icons";
// import { useTheme } from "../../../context";
import { useTheme } from '@iea/react-components'
import classes from "./css/Modal.module.css";

export default ({ children, open, click, size }) => {
  const opened = open ? classes.open : "";
  const theme = useTheme();

  return (
    <div
      style={theme.style}
      className={[classes.ModalWrapper, classes[size], opened].join(" ")}
    >
      <div className={classes.ModalContainer}>
        <div className={classes.Button}>
          <Icon type="close" button={true} click={click} dark stroke />
        </div>
        <div className={classes.ModalContent}>{children}</div>
      </div>
    </div>
  );
};
