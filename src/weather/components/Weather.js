import React, { useEffect, useState } from 'react';
import { useMap } from '../../components/customHooks';
import Papa from 'papaparse';
import axios from 'axios';


export default props => {

    const [data, setData] = useState(null);
    const mapConfig = { center: [1, 1], maxBounds: [[-179, -58],[179, 84]] };
    const { map, mapContainerRef } = useMap({mapConfig});
    
    const urlList = [
        'solar_radiation',
        'hdd',
        'cdd'
    ];
    
    let baseURL = process.env.REACT_APP_DEV;
    if (process.env.NODE_ENV === 'production') baseURL = process.env.REACT_APP_PROD;
    
    let urls = [];
    urlList.forEach(url => (urls.push(axios.get(`${baseURL}csv/${url}.csv`))))
    
    useEffect (() => {
		axios.all(urls)
			.then(responses => {

                let results = [];
                responses.forEach((response, i) => 
                    results.push(Papa.parse(response.data, { header: true }).data));
                
                let data = results[0].map((d,i) => {
					let hdd = results[1][i], cdd = results[2][i];
					return {
						country: d.names,
						figures: {
							solar: Object.values(d).slice(1),
							hdd: Object.values(hdd).slice(1),
							cdd: Object.values(cdd).slice(1)
						}
					}					
                })
                setData(data);
			})
	}, [])
    console.log(data);
    // useEffect (() => {
    //     if(!map) return;
    // });

    return <div ref={mapContainerRef} className='map' />;   
}


