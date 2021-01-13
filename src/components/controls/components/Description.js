import React from "react";
// import { useTheme } from "../../../context";
import { useTheme } from "@iea/react-components";

const descriptionStyle = {
  fontSize: ".7rem",
  marginTop: "10px",
  lineHeight: ".9rem",
};

export default ({ options }) => {
  const { style } = useTheme();
  const divStyle = {
    borderTop: "1px solid",
    borderColor: style.borderColor,
  };

  return (
    <div style={divStyle}>
      {options.map((option, idx) => (
        <p key={idx} style={descriptionStyle}>
          {option}
        </p>
      ))}
    </div>
  );
};
