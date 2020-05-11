import React from 'react';
import { Map } from './gtf';
import { Weather } from './weather';
import { Auth } from './components/fakeAuth';
import { Route, Link, Switch } from 'react-router-dom';
import './App.css';


function App() {
	
	let password = [' ', ' '];
    if (process.env.NODE_ENV === 'production') password = [process.env.REACT_APP_GTF_PW, process.env.REACT_APP_WEATHER_PW];
	
	let projects = [
		{ id: 1, item: 'GTF', url: '/gtf', component: Map, exact: true, pw: password[0], title: 'IEA GTF 2020 DEMO' },
		{ id: 2, item: 'Weather', url: '/weather', component: Weather, exact: true, pw: password[1], title: 'IEA WEATHER VIZ 2020 DEMO' },
	];

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
									<C {...props} /> 
								// </Auth>
							}
						/>
				))}
			</Switch>
		</>
	)
	
}

export default App;