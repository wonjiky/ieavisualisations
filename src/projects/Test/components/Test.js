import React from "react";
import {
  MapContainer,
} from "@iea/react-components";

const CCUSProject = () => {
  return (
    <MapContainer
      selector="CCUSProjects"
      loaded={[1,2,3,4]}
      theme="dark"
    >
    </MapContainer>
  );
};

export default CCUSProject;
