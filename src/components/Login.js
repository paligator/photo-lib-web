import React, { useState, useRef } from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import * as actions from "../constants/action-types";
import useForm from "react-hook-form";
import { isPasswordComplex } from "../api/Utils";
import GoogleLogin from 'react-google-login';
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from 'react-router-dom';

const Login = ({ googleToken }) => {

	const node = useRef();
	const dispatch = useDispatch();

	const [hideWrongLoginMsg, setHideWrongLoginMsg] = useState(googleToken ? "dependsOnGoogle" : "dependsOnRedux");
	const reduxUnSuccessfulLogin = useSelector(state => state.unSuccessfulLogin || false);
	const { register, errors, clearError, triggerValidation } = useForm({ mode: 'onSubmit', reValidateMode: 'onSubmit', validateCriteriaMode: 'all' });

	if (googleToken) {
		dispatch({ type: actions.LOGIN_GOOGLE, payload: { googleToken: googleToken } });
		return (<Redirect to="/" />);
	}

	function hideWrongLogin(e) {
		clearError(e.target.name);
		setHideWrongLoginMsg("yes");
	}

	async function doLogin(event) {
		event.preventDefault();
		const formValuesAreValid = await triggerValidation();

		if (formValuesAreValid !== true) {
			return;
		}

		const email = node.current.querySelector("#txtEmail").value;
		const password = node.current.querySelector("#txtPassword").value;

		setHideWrongLoginMsg("dependsOnRedux");
		dispatch({ type: actions.LOGIN, payload: { email, password } });

	}

	function validatePassword(value) {
		if (isPasswordComplex(value) === true) {
			return true;
		} else {
			return "Password must be complex";
		}
	}

	const ErrorMessage = ({ error }) => {
		if (error) {

			let msg;

			if (error.message) {
				msg = error.message;
			} else {
				switch (error.type) {
					case "required": msg = "This is required"; break;
					case "pattern": msg = "Must meet pattern"; break;
					case "validate": msg = "Not valid"; break;
					default: msg = "Wrong value";
				}
			}
			return <p className="validationMsg">{msg}</p>;
		}

		return null;
	};

	const responseGoogle = async (response) => {
		console.log("Login Google OAuth success: " + JSON.stringify(response));
		if (response.tokenId) {
			dispatch({ type: actions.LOGIN_GOOGLE, payload: { googleToken: response.tokenId } });
		} else {
			console.error("Invaid google OAuth response");
		}
	};

	const responseGoogleError = async (response) => {
		console.error("Login Google OAuth error: " + JSON.stringify(response));
	};

	return (
		<div ref={node} className="flexContainer" style={{ width: "100%" }}>
			<Form style={{ width: "20em", paddingTop: "10vh" }} onSubmit={doLogin}>
				<FormGroup>
					<Label for="txtEmail">Email</Label>
					<Input name="email" id="txtEmail" placeholder="guest@paligator.sk" autoComplete="username" innerRef={register({ required: true, pattern: { value: /^\S+@\S+$/i, message: "Must be valid email" } })} onChange={e => hideWrongLogin(e)} />
					<ErrorMessage error={errors.email} fieldName="Username"></ErrorMessage>
				</FormGroup>
				<FormGroup>
					<Label for="txtPassword">Password</Label>
					<Input type="password" name="password" id="txtPassword" placeholder="Password123" autoComplete="current-password" innerRef={register({ required: true, validate: validatePassword })} onChange={e => hideWrongLogin(e)} />
					<ErrorMessage error={errors.password}></ErrorMessage>
				</FormGroup>
				<FormGroup style={{ textAlign: "center" }}>
					<Button className="btn-primary" style={{ marginBottom: 0 }}>Login</Button>
				</FormGroup>
				{(hideWrongLoginMsg === "dependsOnRedux" && reduxUnSuccessfulLogin === true) ? <FormGroup><div className="alert alert-danger">Wrong email or password!</div></FormGroup> : (null)}
				{(hideWrongLoginMsg === "dependsOnGoogle" && reduxUnSuccessfulLogin === true) ? <FormGroup><div className="alert alert-danger">Something wrong with Google login!</div></FormGroup> : (null)}
				<FormGroup style={{ textAlign: "center" }} className="googleLoginButton">
					<GoogleLogin
						clientId="97296305214-ec3aaco5i3bduubkfbd028hdbror2g7q.apps.googleusercontent.com"
						buttonText="Log in with Google"
						theme="dark"
						cookiePolicy={'single_host_origin'}
						uxMode={'redirect'}
						redirectUri={'https://paligator.sk/google-login/'}
						onSuccess={responseGoogle}
						onFailure={responseGoogleError}
					/>
				</FormGroup>
			</Form>
		</div >
	);
}

export default Login;

