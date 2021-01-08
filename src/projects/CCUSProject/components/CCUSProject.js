import React, { useState } from "react";
import {
  ControlWrapper,
  ControlContainer,
} from "../../../components/controls";
import { Icon } from '../../../components/icons'
import { Legends } from "../../../components/legends";
import { MapContainer } from "../../../components/container";
import PROJECTS from "../assets/projects.json";
import Map from "./Map";
import classes from "./css/CCUSProjects.module.css";

const CCUSProject = () => {
  const [project, setProject] = useState({});
  const projects = [...PROJECTS];
  const data = {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: projects.map((project) => ({
        type: "Feature",
        properties: { ...project },
        geometry: {
          type: "Point",
          coordinates: [project.lon, project.lat],
        },
      })),
    },
  };

  const legends = [
    {
      type: "category",
      header: ["Sector"],
      labels: ["Industry/Fuel transformation", "Power"],
      colors: ["#3e7ad3", "#00ada1"],
      selected: ["Industry/Fuel transformation", "Power"],
      round: true,
      click: (val) => console.log(val),
    },
  ];

  
  return (
    <MapContainer
      selector="CCUSProjects"
      loaded={data}
      theme="light"
    >
      <Map
        data={data}
        project={project}
        click={(e) => setProject(e.features[0].properties) }
      />
      <ControlWrapper bg={true}>
        <ControlContainer position="bottomRight">
          {legends.map((legend, idx) => (
            <Legends key={idx} {...legend} />
          ))}
        </ControlContainer>
        <ProjectInformation project={project} click={(_) => {
          setProject({});
          
          }} />
      </ControlWrapper>
    </MapContainer>
  );
};

export default CCUSProject;

const ProjectInformation = ({ project, click }) => {
  const hasProject = Object.keys(project).length > 0;
  const wrapperStyle = hasProject ? [classes.ProjectInfoWrapper, classes.open].join(' ') : classes.ProjectInfoWrapper;
  const contentStyle = hasProject
    ? [classes.ProjectContent, classes.visible].join(" ")
    : classes.ProjectContent;
  return (
    <div className={wrapperStyle}>
      
        <>
          <div className={classes.CloseButton}>
            <Icon type="close" button={true} click={click} dark stroke />
          </div>
          <div className={contentStyle}>
            <h5
            style={{
              color: project.sectorType === "Power" ? "#00ada1" : "#3e7ad3",
            }}
          >
            {project.facility}
          </h5>
          <p className={classes.ProjectDescription}>{project.description}</p>
            <span>Country</span>
            <br />
            <p className={classes.ProjectDescription}> {project.country} </p>
            <span>Operation date</span>
            <br />
            <p className={classes.ProjectDescription}>
              {project.operationDate}
            </p>
            <span>Retrofit or new</span>
            <br />
            <p className={classes.ProjectDescription}> {project.status} </p>
            <span>Capture rate (Mtpa)</span>
            <br />
            <p className={classes.ProjectDescription}>
              {project.captureRate}
            </p>
            <span>Sector</span>
            <br />
            <p className={classes.ProjectDescription}> {project.sector} </p>
            <span>Feedstock</span>
            <br />
            <p className={classes.ProjectDescription}> {project.feedstock} </p>
            <span>Primary storage type</span>
            <br />
            <p className={classes.ProjectDescription}>
              {project.storageType}
            </p>
            <span>Storage location</span>
            <br />
            <p className={classes.ProjectDescription}> {project.location} </p>
            <span>Transport length (km)</span>
            <br />
            <p className={classes.ProjectDescription}> {project.length} </p>
            <span>Transportation type</span>
            <br />
            <p className={classes.ProjectDescription}>
              {project.transportType}
            </p>
            <div className={classes.Description}>
              Mtpa = mega tonnes per annum. <br />
              EOR = enhanced oil recovery. <br />
              Dedicated refers to sites with the sole purpose of CO2 storage,
              and not associated with enhanced oil recovery.
            </div>
          </div>
      </>
    </div>
  );
};
