import React from "react";
// import {
//   MapContainer,
// } from "../../../components/container";
import {
  MapContainer, useTheme
} from "@iea/react-components";

const CCUSProject = () => {
  return (
    <MapContainer
      selector="CCUSProjects"
      loaded={[1,2,3,4]}
      theme="dark"
    >
      <Test text={'hello world'} />
    </MapContainer>
  );
};


const Test = (props) => { 
  const theme = useTheme();
  console.log(theme);
  return (
    <div style={theme.style}>{props.text}</div>
  )
}

export default CCUSProject;
