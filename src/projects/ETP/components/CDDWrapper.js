import React, { useState, useEffect, useCallback }  from 'react'
import axios from 'axios'
import Papa from 'papaparse'
import CDD from './CDD'
import variables from './assets/variables.json'
import { legend, heatpumpDataMap, serviceDataMap, getCountryNameByISO } from './assets/util'
import { MapContainer } from '../../../components/container'
import { Bars } from '../../../components/bars'
import { Icon } from '../../../components/icons'
import { Legends } from '../../../components/legends'
import { Modal } from '../../../components/modal'
import { ControlWrapper, Control, ControlContainer } from '../../../components/controls'
import classes from './css/ETP.module.css'

function CDDWrapper({ baseURL }) {

  const { mapTypes, years, maps, serviceNeeds, scenarios, regions, serviceNeedsImages, table } = variables;
  const [active, setActive] = useState({ open: false, target: null });
  const [mapType, setMapType] =useState(Object.keys(mapTypes)[0]);
  const [year, setYear] = useState(years[0]);
  const [indicators, setIndicators] = useState(null);
  const [heatpumpData, setHeatpumpData] = useState([]);
  const [country, setCountry] = useState(null);
  const [scenario, setScenario] = useState(scenarios.sds);
  const [region, setRegion] = useState('World'); 
  const [map, setMap] = useState(Object.keys(maps)[0]);
  const [openModal, setOpenModal] = useState(true);

  const DEFAULT_SERVICE_NEED = { "cooling": 1, "heating": 1, "both": 0 };
  const [serviceNeed, setServiceNeed] = React.useState(serviceNeeds[map][DEFAULT_SERVICE_NEED[map]]); 
  
  const isService = mapType === 'service';
  const byMapType = {
    service: {
      filter: serviceDataFilter,
      map: serviceDataMap 
    },
    heatpump: {
      filter: heatpumpDataFilter,
      map: heatpumpDataMap 
    }
  };

  const tempOverlay = serviceNeedsImages[map].filter(d => d.option === serviceNeed)[0].value;

  const mainType = map === 'cooling' ? 'CDD' : map === 'heating' ? 'HDD' : 'both';
  const mainUrl =  `${mainType}_${year}${year === 2019 ? '' : '_' + scenario}`;
  const currMain = `${baseURL}etp/CDD/png/main/${mainUrl}`;
  
  const coolingOrTemp = tempOverlay.substring(0,3) === 'Hot';
  const overlayUrl = map === 'cooling'
    ? `${map}/${coolingOrTemp ? 'Temperature' : 'CDD10'}_${year}_${year === 2019 ? '' : (scenario === 'SDS' ? 26 : 45) + '_'}Masked_${tempOverlay}`
    : map === 'heating'
    ? `${map}/HDD18_${year}_${year === 2019 ? '' : (scenario === 'SDS' ? 26 : 45) + '_'}Masked_${tempOverlay}`
    : `${map}/both_${year}_${year === 2019 ? '' : scenario + '_'}${tempOverlay}`;
  const currOverlay = `${baseURL}etp/CDD/png/${overlayUrl}`;

  const tempIndicators = indicators ? [ ...indicators ] : [];
  const currIndicator = tempIndicators.filter(byMapType[mapType].filter).map(byMapType[mapType].map);

  const currHeatpumpData = heatpumpData.map(mapHeatpumpData);
  const controls = [
		{ 
			type: 'buttonGroup',
      options: Object.keys(mapTypes).map(item => ({ label: mapTypes[item], value: item })),
      selected: mapType,
      dark: true,
      flow: 'row',
      click: e => setMapType(e.value),
    },
    {
      type: 'buttonGroup',
      options: years,
      selected: year,
      dark: true,
      flow: 'row',
			click: value => setYear(value)
    },
    {
      type: 'buttonGroup',
      options: Object.values(scenarios),
      selected: scenario,
      dark: true,
      flow: 'row',
      click: value => setScenario(value),
    },
    {
      type: isService && 'radio',
      options: Object.keys(maps).map(item => ({ label: maps[item], value: item })),
      flow: 'column',
      selected: map,
      change: value => { 
        setMap(value) 
        setServiceNeed(serviceNeeds[value][DEFAULT_SERVICE_NEED[value]]) 
      }    
    },
    {
      type: isService && 'dropdown',
      label: 'Type of service needs',
      options: serviceNeeds[map],
      selected: serviceNeed,
      active: active,
      open: e => setActive({ open: true, target: e.target.value }),
      click: value => setServiceNeed(value)
    },
    {
      type: isService && 'divider',
      marginBottom: "15px"
    }
  ];
  
  let regionDropdown = [
    {
      type: isService && 'dropdown',
      label: 'Regions',
      dark: true,
      options: regions,
      top: true,
      click: value => setRegion(value),
      style: 'horizontal',
      open: e => open(e),
      hide: e => hide(e),
      active: active,
      selected: region,
    }
  ];


  let legends = [
    {
      type: 'continuous',
      header: 'legend',
      subInHeader: false,
      unitTop: mapType === 'service' ? (map === 'cooling' ? 'CDD18' : map === 'heating' ? 'HDD18' : 'Average yearly T (°C)') : 'Index',
      labels: mapType === 'service' ? legend[mapType][map].minmax : legend.heatpump.minmax,
      colors: mapType === 'service' ? legend[mapType][map].color : legend.heatpump.color,
      round: false
    }
  ];

  const open = e => setActive({ open: true, target: e.target.value })

  const hide = useCallback(() => {
    setActive({ open: false, target: null })
    document.removeEventListener('click', hide)
  },[])


  useEffect(() => {
    if (!active.open) return;
    document.addEventListener('click', hide)
	},[ active.open,  hide ])


  useEffect(() => { 
    let url = mapType === 'service' ? variables.maps[map] : 'Heat pump index'
    axios
      .get(`${baseURL}etp/CDD/${url}.csv`)
      .then(response => {
        const tempData = Papa.parse(response.data, { header: true }).data;
        let result = [...tempData];
        if (url === 'Heat pump index') {
          result = result
            .filter(d => getCountryNameByISO(d.ISO))
            .map(d => ({ ...d, title: getCountryNameByISO(d.ISO).region }))
        }
        setIndicators(result)
      })
  },[baseURL, map, mapType])


  useEffect(() => { 
    axios
      .get(`${baseURL}etp/CDD/Heat pump index map.csv`)
      .then(response => {
        const tempData = Papa.parse(response.data, { header: true }).data;
        const filteredData = tempData.filter(d => getCountryNameByISO(d.Code))
        setHeatpumpData(filteredData)
      })
  },[])


  function serviceDataFilter(d) {
    let is2019 =  d.region === region && d.scenario === '0';
    let isNot2019 = d.region === region && d.scenario === scenario && Number(d.year) === year;
    return year === 2019 ? is2019 : isNot2019;   
  }


  function heatpumpDataFilter(d) {
    let is2019 =  d.ISO === country && d.scenario === '0';
    let isNot2019 = d.ISO === country && d.scenario === scenario && Number(d.year) === year;
    return year === 2019 ? is2019 : isNot2019;   
  }

  function mapHeatpumpData(d) {
    let result = { ISO: d.Code };
    year === 2019 
      ? result.value = d[2019]
      : result.value = d[`${year}-${scenario}`]
    return result
  }

  const popup = [
    {
      type: 'popup',
      click: _ => setOpenModal(!openModal),
    }
  ];

  return (
    <MapContainer selector='CDD' loaded={currIndicator}>
      <CDD
        years={year}
        mapType={mapType}
        region={region}
        currOverlay={currOverlay}
        currMain={currMain}
        colors={legend.heatpump.color}
        minMax={legend.heatpump.minmax}
        mapData={currHeatpumpData}
        click={e => setCountry(e)}
      />
      <ControlWrapper dark bg>
        <ControlContainer position='topLeft' style={{'width': '320px'}}> 
          {controls.map((control, idx) => 
            <Control key={idx} {...control} /> )}
          {regionDropdown.map((drop, idx) => 
            <Control key={idx} {...drop} /> )}
          {isService 
            ? <Bars dark data={currIndicator}/>
            : (!country 
              ? <div><p> Select a territory by clicking on the map </p></div>
              : <Bars dark label={currIndicator[0] && currIndicator[0].title} data={currIndicator} titleSize={{"fontSize": "1.25rem"}} />)}
          {popup.map((item, idx) => 
            <Popup key={idx} {...item} />
          )}
        </ControlContainer>
        <ControlContainer position='bottomRight' customClass={classes.Legend}>
          {legends.map((legend, idx) => 
            <Legends key={idx} {...legend} />)}
        </ControlContainer>
      </ControlWrapper>
      <Modal styles='full' open={openModal} click={_ =>  setOpenModal(!openModal)}>
        <Content table={table} />
			</Modal>
    </MapContainer>
  )
}

export default CDDWrapper;

const Popup = ({ click }) => <Icon fill button type='help' dark='float' styles={classes.Help} click={click} title="Glossary of map terms"/>

const Content = ({ table }) => {
  
  return (
    <div>
      <div className={classes.ContentSection}>
        <h3>Need for heating</h3>
        <div className={classes.Content}>
          <p><b>HDD:</b> Heating Degree Days </p>
          <p><b>SDS:</b> Sustainable Development Scenario </p>
          <p><b>STEPS:</b> Stated Policies Scenario </p>
          <br/>
          <p>Heating Degree Days (HDD) shown in this map are calculated using daily average temperatures, base temperature 18°C (HDD18).</p>
          <br/>
          <p>
            Historical <b>temperature</b> values derived from ERA5 hourly data on single levels from 1979 to present. Copernicus Climate Change Service (C3S) Climate Data Store (CDS). (Accessed on 09/11/2020), 10.24381/cds.adbb2d47. More details and data on historical variables can be found in the IEA Weather for energy tracker.
            Future temperature values are derived from NCAR GIS Program. 2012. Climate Change Scenarios, version 2.0. Community Climate System Model, June 2004 version 3.0. http://www.cesm.ucar.edu/models/ccsm3.0/ was used to derive data products. For this analysis, outcomes from RCPs 2.6 and 4.5 have been associated to the SDS and STEPS scenario respectively.
          </p>
          <br/>
          <p>
            <b>Population</b> data are derived from Jones, B., O’Neill, B.C., 2016. Spatially explicit global population scenarios consistent with the Shared Socioeconomic Pathways. Environmental Research Letters 11, 84003. DOI:10.1088/1748-9326/11/8/084003.
            Gao, J., 2017. Downscaling Global Spatial Population Projections from 1/8-degree to 1-km Grid Cells. NCAR Technical Note NCAR/TN-537+STR, DOI: 10.5065/D60Z721H.
          </p>
        </div>
        <Table title='Service needs' body={table.heating.service} head={['Type', 'Description']} />
        <Table title='Indicators' body={table.heating.indicators} head={['Type', 'Description']} />
      </div>
      <div className={classes.ContentSection}>
        <h3>Need for cooling</h3>
        <div className={classes.Content}>
          <p><b>CDD:</b> Heating Degree Days </p>
          <p><b>SDS:</b> Sustainable Development Scenario </p>
          <p><b>STEPS:</b> Stated Policies Scenario </p>
          <br/>
          <p><b>Cooling Degree Days (CDD)</b> shown in this map are calculated using daily average temperatures, base temperature 18°C (CDD18). CDD used to evaluate cooling needs are calculated using daily average temperatures, base temperature 10°C (CDD10).</p>
          <br/>
          <p>
            Historical <b>temperature</b> values derived from ERA5 hourly data on single levels from 1979 to present. Copernicus Climate Change Service (C3S) Climate Data Store (CDS). (Accessed on 09/11/2020), 10.24381/cds.adbb2d47. More details and data on historical variables can be found in the IEA Weather for energy tracker.
            Future temperature values are derived from NCAR GIS Program. 2012. Climate Change Scenarios, version 2.0. Community Climate System Model, June 2004 version 3.0. http://www.cesm.ucar.edu/models/ccsm3.0/ was used to derive data products. For this analysis, outcomes from RCPs 2.6 and 4.5 have been associated to the SDS and STEPS scenario respectively.
          </p>
          <br/>
          <p>
            <b>Population data</b> are derived from Jones, B., O’Neill, B.C., 2016. Spatially explicit global population scenarios consistent with the Shared Socioeconomic Pathways. Environmental Research Letters 11, 84003. DOI:10.1088/1748-9326/11/8/084003. Gao, J., 2017. Downscaling Global Spatial Population Projections from 1/8-degree to 1-km Grid Cells. NCAR Technical Note NCAR/TN-537+STR, DOI: 10.5065/D60Z721H.
          </p>
        </div>
        <Table title='Service needs' body={table.cooling.service} head={['Type', 'Description']} />
        <Table title='Indicators' body={table.cooling.indicators} head={['Type', 'Description']} />
      </div>
      <div className={classes.ContentSection}>
        <h3>Need for heating and cooling</h3>
        <div className={classes.Content}>
          <p><b>SDS:</b> Sustainable Development Scenario </p>
          <p><b>STEPS:</b> Stated Policies Scenario </p>
          <br/>
          <p>
            Historical <b>average yearly temperature values</b> derived from ERA5 hourly data on single levels from 1979 to present. Copernicus Climate Change Service (C3S) Climate Data Store (CDS). (Accessed on 09/11/2020), 10.24381/cds.adbb2d47. More details and data on historical variables can be found in the IEA Weather for energy tracker. Future temperature values are derived from NCAR GIS Program. 2012. Climate Change Scenarios, version 2.0. Community Climate System Model, June 2004 version 3.0. http://www.cesm.ucar.edu/models/ccsm3.0/ was used to derive data products. For this analysis, outcomes from RCPs 2.6 and 4.5 have been associated to the SDS and STEPS scenario respectively.
          </p>
          <br/>
          <p>
            <b>Population data</b> are derived from Jones, B., O’Neill, B.C., 2016. Spatially explicit global population scenarios consistent with the Shared Socioeconomic Pathways. Environmental Research Letters 11, 84003. DOI:10.1088/1748-9326/11/8/084003.
            Gao, J., 2017. Downscaling Global Spatial Population Projections from 1/8-degree to 1-km Grid Cells. NCAR Technical Note NCAR/TN-537+STR, DOI: 10.5065/D60Z721H. 
          </p>
        </div>
        <Table title='Indicators' body={table.both.indicators} head={['Type', 'Description']} />
      </div>
      <div className={classes.ContentSection}>
        <h3>Heat pumps emissions reduction potential</h3>
        <div className={classes.Content}>
          <p><b>SDS:</b> Sustainable Development Scenario </p>
          <p><b>STEPS:</b> Stated Policies Scenario </p>
          <br/>
          <p>
            The heat pump emissions index assesses the emissions reduction potential from switching from a condensing gas boiler (the lowest carbon-intensive fossil-fuel based heating option) to a market median air-source heat pump for space heating. The carbon footprint of heating equipment is averaged across the entire duration of their projected operations, and in particular accounts for changes in the carbon intensity of electricity in each scenario, in the case of heat pumps. For the assessment average annual emissions of heat pumps purchased in 2019, calculations are based on the electricity mix of the Stated Policies Scenario.
          </p>
          <br/>
          <p>
            If the index is positive, running a heat pump is typically less carbon-intensive than running a condensing gas boiler (e.g. 30% lower if the index is equal to 30%, and up to 100%, in which case heat pumps are zero-carbon, i.e. operating in an area where the electricity is entirely decarbonized). If the index is negative, running a heat pump is typically more carbon-intensive than running a condensing gas boiler. If the index is equal to 0, there is no emissions reduction potential since the carbon footprint of market median heat pump operations is equal to one of a condensing gas boiler. 
          </p>
        </div>
      </div>
    </div>
  )
}
const Table = ({ title, body, head }) => (
	<div className={classes.Table}>
		<h5>{title}</h5>
		<div className={classes.TableHeader}>
			<table>
				<thead>
					<tr>
						{head.map((item, idx) => <th key={idx}> {item} </th>)}				
					</tr>
				</thead>
				<tbody>
					{body.map((item, idx) =>
						<tr key={idx}>
							{Object.values(item).map((d,idx) => <td key={idx}>{d}</td> )}
						</tr>
					)}
				</tbody>
			</table>
		</div>
	</div>
);