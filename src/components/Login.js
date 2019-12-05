import React, { useState, useRef } from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import * as actions from "../constants/action-types";

import { useSelector, useDispatch } from "react-redux";

const Login = () => {

	const node = useRef();
	const dispatch = useDispatch();

	const [hideWrongLoginMsg, setHideWrongLoginMsg] = useState("dependsOnRedux");
	const reduxUnSuccessfulLogin = useSelector(state => {	
		return state.unSuccessfulLogin || false;
	});

	function hideWrongLogin() {
		setHideWrongLoginMsg("yes");
	}

	function doLogin(event) {
		event.preventDefault();

		const email = node.current.querySelector("#txtEmail").value;
		const password = node.current.querySelector("#txtPassword").value;

		setHideWrongLoginMsg("dependsOnRedux");
		dispatch({ type: actions.LOGIN, payload: { email, password } });
	}

	return (
		<div ref={node} className="flexContainer" style={{ width: "100%" }}>
			<Form style={{ width: "20em", paddingTop: "10vh" }} onSubmit={doLogin}>
				<FormGroup>
					<Label for="txtEmail">Email</Label>
					<Input type="email" name="email" id="txtEmail" placeholder="guest@paligator.sk" required onChange={(() => hideWrongLogin())} />
				</FormGroup>
				<FormGroup>
					<Label for="txtPassword">Password</Label>
					<Input type="password" name="password" id="txtPassword" placeholder="Password123" required onChange={(() => hideWrongLogin())} />
				</FormGroup>
				<FormGroup style={{ textAlign: "center" }}><Button className="btn-primary">Login</Button></FormGroup>
				{(hideWrongLoginMsg === "dependsOnRedux" && reduxUnSuccessfulLogin === true) ? <FormGroup><div className="alert alert-danger">Wrong email or password!</div></FormGroup> : (null)}
			</Form>
		</div >
	);
}

export default Login;

