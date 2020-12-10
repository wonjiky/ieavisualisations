import React, { useState } from 'react'
import Map from './Map'
import { MapContainer } from '../../../components/container'
import PROJECTS from '../assets/projects.json'

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

  console.log(project);
  return (
    <MapContainer selector='CCUSProjects' loaded={data}>
      <Map 
        data={data}
        click={e => setProject(e.features[0].properties)} 
      />      
    </MapContainer>
  )
}

export default CCUSProject
