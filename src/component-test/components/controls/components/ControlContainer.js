import React from "react";
import { useTheme } from "../../../context";
import classes from "./css/ControlContainer.module.css";

const ControlContainer = ({
  children,
  position,
  style,
  customClass,
  transparent,
}) => {
  const theme = useTheme();
  const wrapperStyle = [
    classes.ControlWrapper,
    classes[position],
    customClass,
  ].join(" ");
  const containerStyle = {
    background: transparent ? "transparent" : theme.style.background,
    boxShadow: transparent && "none",
  };

  return (
    <div
      className={wrapperStyle}
      style={{ color: theme.style.color, ...style }}
    >
      <div className={classes.ControlContainer} style={containerStyle}>
        {React.Children.map(
          children,
          (child) =>
            child &&
            child.props.type !== "floatingButtons" &&
            React.cloneElement(child)
        )}
      </div>
      {React.Children.map(
        children,
        (child) =>
          child &&
          child.props.type === "floatingButtons" &&
          React.cloneElement(child)
      )}
    </div>
  );
};

export default ControlContainer;
