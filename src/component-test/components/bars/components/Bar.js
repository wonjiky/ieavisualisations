import React from "react";
import { useTheme } from "../../../context";
import classes from "./css/Bar.module.css";

const Bar = (props) => {
  const { bar, style } = useTheme();

  return (
    <div className={classes.Bar}>
      <div className={classes.BarLabel} style={{ color: style.color }}>
        <p>{props.label}</p>
        <span>{props.value}% </span>
      </div>
      <div
        className={classes.Bar_Wrapper}
        style={{ borderColor: bar.borderColor }}
      >
        <div
          className={classes.Bar_Percentage}
          style={{ width: `${props.value}%`, background: bar.background }}
        />
      </div>
    </div>
  );
};

export default Bar;
