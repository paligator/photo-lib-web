import React, { useState, useRef } from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import * as actions from "../constants/action-types";
import useForm from "react-hook-form";
import { isPasswordComplex } from "../api/Utils";

import { useSelector, useDispatch } from "react-redux";

const Login = () => {

	const node = useRef();
	const dispatch = useDispatch();

	const [hideWrongLoginMsg, setHideWrongLoginMsg] = useState("dependsOnRedux");
	const reduxUnSuccessfulLogin = useSelector(state => state.unSuccessfulLogin || false);
	const { register, errors, clearError, triggerValidation } = useForm({ mode: 'onSubmit', reValidateMode: 'onSubmit', validateCriteriaMode: 'all' });

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
		if(isPasswordComplex(value) === true) {
			return true;
		} else {
			return "Password must be complex";
		}
	}

	const ErrorMessage = ({ error }) => {
		if (error) {

			if (error.message) {
				return <p>{error.message}</p>;
			}

			switch (error.type) {
				case "required":	return <p>This is required</p>;
				case "pattern":		return <p>Must meet pattern</p>;
				case "validate":	return <p>Not valid</p>;
				default:	return null;
			}
		}
		
		return null;
	};

	return (
		<div ref={node} className="flexContainer" style={{ width: "100%" }}>
			<Form style={{ width: "20em", paddingTop: "10vh" }} onSubmit={doLogin}>
				<FormGroup>
					<Label for="txtEmail">Email</Label>
					<Input name="email" id="txtEmail" placeholder="guest@paligator.sk" innerRef={register({ required: true, pattern: { value: /^\S+@\S+$/i, message: "Must be valid email" } })} onChange={e => hideWrongLogin(e)} />
					<ErrorMessage error={errors.email} fieldName="Username"></ErrorMessage>
				</FormGroup>
				<FormGroup>
					<Label for="txtPassword">Password</Label>
					<Input type="password" name="password" id="txtPassword" placeholder="Password123" innerRef={register({ required: true, validate: validatePassword })} onChange={e => hideWrongLogin(e)} />
					<ErrorMessage error={errors.password}></ErrorMessage>
				</FormGroup>
				<FormGroup style={{ textAlign: "center" }}><Button className="btn-primary">Login</Button></FormGroup>
				{(hideWrongLoginMsg === "dependsOnRedux" && reduxUnSuccessfulLogin === true) ? <FormGroup><div className="alert alert-danger">Wrong email or password!</div></FormGroup> : (null)}
			</Form>
		</div >
	);
}

export default Login;

