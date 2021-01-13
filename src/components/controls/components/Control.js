import React from "react";
import { Slider, Button, Dropdown, Input, Description } from "../index";
// import { useTheme } from '../../../context'
import { useTheme } from "@iea/react-components";

export default (props) => {
  const { style } = useTheme();

  switch (props.type) {
    case "dropdown":
      return <Dropdown {...props} />;

    case "button":
      return <Button {...props} />;

    case "checkbox":
    case "radio":
      return <Input {...props} />;

    case "slider":
      return <Slider {...props} />;

    case "description":
      return <Description {...props} />;

    case "divider":
      return (
        <div
          style={{
            width: "100%",
            borderBottom: "1px solid",
            borderColor: style.borderColor,
            marginBottom: `${props.marginBottom ? props.marginBottom : 0}px`,
            marginTop: `${props.marginTop ? props.marginTop : 0}px`,
          }}
        />
      );

    default:
      return null;
  }
};
