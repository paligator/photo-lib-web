import React, { Component } from 'react';
import { connect } from "react-redux";
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import * as actions from "../constants/action-types";

class Login extends Component {

	constructor(props) {
		super(props);
		this.doLogin = this.doLogin.bind(this);
		this.state = { wrongLogin: this.props.wrongLogin };
	}

	static getDerivedStateFromProps(props, state) {

		if (state.source === "hide") {
			return { wrongLogin: false, source: "" }
		}

		if (props.wrongLogin === state.wrongLogin) {
			return null;
		} else {
			return { wrongLogin: props.wrongLogin, source: "" }
		}
	}

	doLogin(event) {
		event.preventDefault();

		const data = new FormData(event.target);
		const email = data.get("email");
		const password = data.get("password");

		this.props.onLogin(email, password);
	}

	render() {
		return (
			<div className="flexContainer" style={{ width: "100%" }}>
				<Form style={{ width: "20em", paddingTop: "10vh" }} onSubmit={this.doLogin}>
					<FormGroup>
						<Label for="txtEmail">Email</Label>
						<Input type="email" name="email" id="txtEmail" placeholder="@" onChange={(() => this.hideWrongLogin())} />
					</FormGroup>
					<FormGroup>
						<Label for="txtPassword">Password</Label>
						<Input type="password" name="password" id="txtPassword" placeholder="" onChange={(() => this.hideWrongLogin())} />
					</FormGroup>
					<FormGroup style={{textAlign: "center"}}><Button>Login</Button></FormGroup>
					{(this.state.wrongLogin === true) ? <FormGroup><div className="alert alert-danger">Wrong email or password!</div></FormGroup> : (null)}
				</Form>
			</div >
		)
	}

	hideWrongLogin() {
		this.setState({ wrongLogin: false, source: "hide" });
	}
}

function mapStateToProps(state) {
	return {
		wrongLogin: state.unSuccessfulLogin
	};
}

function mapDispatchToProps(dispatch) {
	return {
		onLogin: (email, password) => {
			dispatch({ type: actions.LOGIN, payload: { email, password } });
		},
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
