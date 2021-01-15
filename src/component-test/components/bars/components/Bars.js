import React from "react";
import Bar from "./Bar";
import { useTheme } from "../../../context";
import classes from "./css/Bars.module.css";

const Bars = ({ unit, data, title }) => {
  const theme = useTheme();

  return (
    <div style={{ color: theme.style.color }}>
      <div className={classes.BarsLabel}>
        {title && <h5>{title}</h5>}
        {unit && <p> {unit} </p>}
      </div>
      {data.map((d, i) => (
        <Bar key={i} {...d} />
      ))}
    </div>
  );
};

export default Bars;
