import React from 'react';
import { Weather } from './projects/WEATHER';
import { GTF_Flow, GTF_Vector } from './projects/GTF';
import { Electricity } from './projects/Electricity';
import { CCUS } from './projects/CCUS';
import { CDDMap } from './projects/ETP';
import { Auth } from './components/fakeAuth';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import './App.css';


function App() {

	let password = [' ', ' ', ' ', ' '];
	if (process.env.NODE_ENV === 'production') password = [
		process.env.REACT_APP_GTF_PW, 
		process.env.REACT_APP_GTF2_PW, 
		process.env.REACT_APP_WEATHER_PW,
		process.env.REACT_APP_ETP2020_PW,
	];
	
	let projects = [
		{ id: 1, item: 'GTF', url: '/gtf-vector', component: GTF_Vector, exact: true, pw: password[0], title: 'GTF: Vector' },
		{ id: 2, item: 'GTF-FLOW', url: '/gtf-flow', component: GTF_Flow, exact: true, pw: password[1], title: 'GTF: Flow' },
		{ id: 3, item: 'WEATHER', url: '/weather-country', component: Weather, exact: true, pw: password[2], title: 'WEATHER' },
		{ id: 4, item: 'ETP CCUS - US', url: '/etp-ccus-us', component: CCUS, exact: true, pw: password[3], title: 'ETP2020 - CO2 Map' },
		{ id: 5, item: 'ETP CCUS - Europe', url: '/etp-ccus-europe', component: CCUS, exact: true, pw: password[3], title: 'ETP2020 - CO2 Map' },
		{ id: 6, item: 'ETP CCUS - China', url: '/etp-ccus-china', component: CCUS, exact: true, pw: password[3], title: 'ETP2020 - CO2 Map' },
		{ id: 7, item: 'ETP2020 - CDD', url: '/ETP2020-cdd', component: CDDMap, exact: true, pw: password[3], title: 'ETP2020 - CDD Map' },
		{ id: 8, item: 'COVID impact on electricity', url: '/electricity-project', component: Electricity, exact: true, pw: password[3], title: 'Electricity-project' },
	];

	let baseURL = process.env.REACT_APP_DEV;
	if (process.env.NODE_ENV === 'production') baseURL = process.env.REACT_APP_PROD;	

	return (
		<Router basename={process.env.PUBLIC_URL}>
			<Switch>
				<Route path='/' exact render={ _ => (
					<div className='Intro'>
						<h1>IEA map demo</h1>
						{projects.map((project, idx) => (
							<Link key={`${project.item}-${idx}`} to={project.url}>{project.item}</Link>
						))}
					</div>
				)} />
				{projects.map(({ id, item, url, pw, title, component: C, exact }) => (
					<Route
						key={`${item}-${id}`}
						path={`${url}`}
						url={url}
						exact={exact}
						render={ props => 
							<Auth pw={pw} title={title}>	
								<C {...props} baseURL={baseURL} /> 
							</Auth>
						}
					/>
			))}
			</Switch>
			</Router>
	)
}

export default App;