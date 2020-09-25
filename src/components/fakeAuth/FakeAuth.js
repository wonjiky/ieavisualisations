import React, { Component } from 'react';
import { Input } from '../input';
import  Button from './Button';
import classes from './css/FakeAuth.module.css';

class Auth extends Component {
	state = {
		authenticated: false,
		controls: {
				password: {
					elementType: 'input',
					elementConfig: {
							type: 'password',
							placeholder: 'password'
					},
					value: '',
					validation: {
							required: true,
							minLength: 7
					}
			}
		}
	}

	checkValidity(value, rules) {
		let isValid = true;
		if ( rules.required) isValid = value.trim() !== '' && isValid;
		if ( rules.minLength) isValid = value.length >= rules.minLength && isValid;
		if ( rules.maxLength) isValid = value.length <= rules.maxLength && isValid;
		return isValid;
	}

	inputChangedHandler = (event, controlName) => {
		const updatedControls = { 
			...this.state.controls,
			[controlName]: {
				...this.state.controls[controlName],
				value: event.target.value,
				valid: this.checkValidity(event.target.value, this.state.controls[controlName].validation),
				touched: true,
			}
		}
		this.setState({ controls: updatedControls })
	}

	submitHandler = event  => {
		event.preventDefault();
		const password = this.state.controls.password.value;
		const authentication = this.props.pw;
		if( password === authentication ){
			this.setState({ authenticated: true })
		}
	}

	render() {
		const formElementsArray = [];
		for (let key in this.state.controls){
			formElementsArray.push({
				id: key,
				config: this.state.controls[key]
			});
		}

		const form = formElementsArray.map(formElement => (
			<Input 
				key={formElement.id}
				elementType={formElement.config.elementType}
				elementConfig={formElement.config.elementConfig}
				invalid={!formElement.config.valid}
				value={formElement.config.value}
				touched={formElement.config.touched}
				shouldValidate={formElement.config.validation}
				changed={(e) => this.inputChangedHandler(e, formElement.id)} 
			/>
		))
			
		let content = (
			<div className={classes.Auth}>
				<div onClick={this.submitHandler}>
					<h1>{this.props.title}</h1>
					<form onSubmit={this.submitHandler}>
						{form}
						<button>SUBMIT</button>
						{/* <Button btnType="Success"> SUBMIT </Button> */}
					</form>
				</div>
			</div>
		)

		if ( this.state.authenticated ) content =this.props.children;
		return this.props.children;
	}
}

export default Auth;