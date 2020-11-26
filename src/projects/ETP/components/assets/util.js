import countries from '../assets/countriesIso.json'

export const legendColors = {
  service: {
    heating: ['#ffffe0', '#ccf0df', '#afdcd8', '#98c7d1', '#83b2c8', '#719cc0', '#5f87b7', '#4e72ad', '#3b5ea3', '#264a9a', '#003790'],
    cooling: ['#008712', '#99b95e', '#b3c661', '#ccd45f', '#e5e25a', '#ffe06d', '#ffc42a', '#f1ac32', '#e4932f', '#d67a29', '#c96122', '#bb461a', '#b93326'],
    both: ['#008712', '#99b95e', '#b3c661', '#ccd45f', '#e5e25a', '#ffe06d', '#ffc42a', '#f1ac32', '#e4932f', '#d67a29', '#c96122', '#bb461a', '#b93326']
  },
  heatpump: {
    heatpump: ['#008712', '#99b95e', '#b3c661', '#ccd45f', '#e5e25a', '#ffe06d', '#ffc42a', '#f1ac32', '#e4932f', '#d67a29', '#c96122', '#bb461a', '#b93326']
  }
};

export const serviceDataMap = d => ({ label: d.variable, value: d.value });
export const heatpumpDataMap = d => ({ title: d.region, label: d.variable, value: d.value });
export const getCountryNameByISO = iso => !countries.find(d => d.ISO3 === iso) ? null : countries.find(d => d.ISO3 === iso);
