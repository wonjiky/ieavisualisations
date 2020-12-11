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
        "EOR = enhanced oil recovery;",
        "Mtpa = mega tonnes per annum;",
        "Large-scale is defined as involving the capture of at least 0.8 Mt/year of CO2 for a coal-based power plant and 0.4 Mt/year for other emissions-intensive industrial facilities (including natural gas-based power generation)."
      ],
      theme: 'light'
    }
  ];

  const legends = [
    {
      type: 'category',
      header: ['Sector type'],
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
        <ControlContainer position='bottomLeft'>
          {legends.map((legend, idx) => 
            <Legends key={idx} {...legend} />)}
        </ControlContainer>
        <ControlContainer position='topLeft' style={{'width': '320px'}}>
          <ProjectInfo 
            project={project}
          /> 
          {controls.map((d, idx) => 
            <Control key={idx} {...d} />)}
        </ControlContainer>
        
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
          <span>Country</span><br/>
          <p> {project.country} </p>
          <span>Operation date</span><br/>
          <p> {project.operationDate} </p>
          <p className={classes.ProjectDescription}> {project.description} </p>
        </div>
      }
    </div>
  )
}
