import React from 'react';
import { Weather } from './weather';
import { GTF_Flow, GTF_Vector } from './gtf';
import { WeatherByGrid, WeatherByGrid_Vector } from './weatherbygrid';
import { CO2Map } from './etp2020';
// import { Auth } from './components/fakeAuth';
import { Route, Link, Switch } from 'react-router-dom';
import './App.css';


function App() {
	
	let password = [' ', ' ', ' '];
	if (process.env.NODE_ENV === 'production') password = [process.env.REACT_APP_GTF_PW, process.env.REACT_APP_GTF2_PW, process.env.REACT_APP_WEATHER_PW];
	
	let projects = [
		{ id: 1, item: 'GTF', url: '/gtf-vector', component: GTF_Vector, exact: true, pw: password[0], title: 'GTF: Vector' },
		{ id: 2, item: 'GTF-FLOW', url: '/gtf-flow', component: GTF_Flow, exact: true, pw: password[1], title: 'GTF: Flow' },
		{ id: 3, item: 'Weather - by country', url: '/weather-country', component: Weather, exact: true, pw: password[2], title: 'Weather: by country' },
		{ id: 4, item: 'Weather - by grid - webgl', url: '/weather-grid-1', component: WeatherByGrid, exact: true, pw: password[2], title: 'Weather: by grid - v1' },
		{ id: 5, item: 'Weather - by grid - vector', url: '/weather-grid-2', component: WeatherByGrid_Vector, exact: true, pw: password[2], title: 'Weather: by grid - v2' },
		{ id: 6, item: 'ETP2020 - CO2', url: '/ETP2020-co2', component: CO2Map, exact: true, pw: password[2], title: 'ETP2020 - CO2 Map' },
	];

	let baseURL = process.env.REACT_APP_DEV;
	if (process.env.NODE_ENV === 'production') baseURL = process.env.REACT_APP_PROD;	
	return (
		<>
			<Route path='/' exact render={ _ => (
				<div className='Intro'>
					<h1>IEA map demo</h1>
					{projects.map((project, idx) => (
						<Link key={`${project.item}-${idx}`} to={project.url}>{project.item}</Link>
					))}
				</div>
			)} />
			<Switch>
				{projects.map(({ id, item, url, pw, title, component: C, exact }) => (
						<Route
							key={`${item}-${id}`}
							path={`${url}`}
							exact={exact}
							render={ props => 
								// <Auth pw={pw} title={title}>	
									<C {...props} baseURL={baseURL} /> 
							  // </Auth>
							}
						/>
				))}
			</Switch>
		</>
	)
}

export default App;