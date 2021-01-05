import React, { useState } from 'react'
import { ControlWrapper, ControlContainer, Control } from '../../../components/controls' 
import { Legends } from '../../../components/legends'
import { MapContainer } from '../../../components/container'
import PROJECTS from '../assets/projects.json'
import Map from './Map'

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
  ];

  return (
    <MapContainer 
      selector='CCUSProjects' 
      loaded={data} 
      fluid={true}
      dark={false}
    >
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
              {controls.map((d, idx) => 
                <Control key={idx} {...d} />)}
            </ControlContainer>
            
        }
      </ControlWrapper>
    </MapContainer>
  )
}

export default CCUSProject;