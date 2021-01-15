import React from "react";
import { useTheme } from "../../../context";

const descriptionStyle = {
  fontSize: ".7rem",
  marginTop: "10px",
  lineHeight: ".9rem",
};

const Description = ({ options }) => {
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

export default Description;
