import React, { useState } from 'react'
import { ControlWrapper, ControlContainer, Control } from '../../../components/controls' 
import { Legends } from '../../../components/legends'
import { MapContainer } from '../../../components/container'
import PROJECTS from '../assets/projects.json'
import Map from './Map'
import classes from './css/CCUSProjects.module.css'

const CCUSProject = () => {
  const [project, setProject] = useState({});
  const projects = [...PROJECTS];
  const data = {
    'type': 'geojson',
    'data': {
      'type': 'FeatureCollection',
      'features': projects.map(project => (
        {
          'type': 'Feature',
          'properties': { ...project },
          'geometry': {
            'type': 'Point',
            'coordinates': [project.lon, project.lat]
          },
          
        }
      )) 
    }
  }

  const controls = [
    {
      type: 'description',
      options: [
        "EOR = enhanced oil recovery.",
        "Mtpa = mega tonnes per annum.",
        "Dedicated storage refers to sites with the sole purpose of CO2 storage, and not associated with enhanced oil recovery."
      ],
      theme: 'light'
    }
  ];

  const legends = [
    {
      type: 'category',
      header: ['Sector'],
      labels: ['Industry/Fuel transformation', 'Power'],
      colors: ['#3e7ad3', '#00ada1'],
      selected: ['Industry/Fuel transformation', 'Power'],
      round: true,
      click: val => console.log(val)
    }
  ]

  
  return (
    <MapContainer selector='CCUSProjects' loaded={data}>
      <Map 
        data={data}
        project={project}
        click={e => setProject(e.features[0].properties)} 
      />      
      <ControlWrapper bg={true}>
        <ControlContainer position='bottomRight'>
          {legends.map((legend, idx) => 
            <Legends key={idx} {...legend} />)}
        </ControlContainer>
        {

          Object.keys(project).length === 0 
          ? <></>
          : <ControlContainer position='topLeft' style={{'width': '320px', 'maxHeight': '740px'}}>
              <ProjectInfo project={project} /> 
              {controls.map((d, idx) => 
                <Control key={idx} {...d} />)}
            </ControlContainer>
            
        }
      </ControlWrapper>
    </MapContainer>
  )
}

export default CCUSProject

const ProjectInfo = ({ project }) => {
  let hasProject = Object.keys(project).length > 0;
  return (
    <div className={classes.ProjectInfoWrapper}>
      {!hasProject 
        ? <div className={classes.NotSelected}>Select a project by clicking on the map</div>
        : <div className={classes.ProjectContent}>
          <h5 style={{'color': project.sectorType === 'Power' ? '#00ada1' : '#3e7ad3'}}> {project.facility} </h5>
          <p className={classes.ProjectDescription}> {project.description} </p>
          <span>Country</span><br/>
          <p className={classes.ProjectDescription}> {project.country} </p>
          <span>Operation date</span><br/>
          <p className={classes.ProjectDescription}> {project.operationDate} </p>
          <span>Retrofit or new</span><br/>
          <p className={classes.ProjectDescription}> {project.status} </p>
          <span>Capture rate (Mtpa)</span><br/>
          <p className={classes.ProjectDescription}> {project.captureRate} </p>
          <span>Sector</span><br/>
          <p className={classes.ProjectDescription}> {project.sector} </p>
          <span>Feedstock</span><br/>
          <p className={classes.ProjectDescription}> {project.feedstock} </p>
          <span>Primary storage type</span><br/>
          <p className={classes.ProjectDescription}> {project.storageType} </p>
          <span>Storage location</span><br/>
          <p className={classes.ProjectDescription}> {project.location} </p>
          <span>Transport length (km)</span><br/>
          <p className={classes.ProjectDescription}> {project.length} </p>
          <span>Transportation type</span><br/>
          <p className={classes.ProjectDescription}> {project.transportType} </p>
        </div>
      }
    </div>
  )
}
