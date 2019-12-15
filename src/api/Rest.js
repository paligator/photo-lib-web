import config from '../config';
import axios from "axios";

export async function get(endpoint) {
	try {
		const response = await fetch(config.api.url + endpoint, {
			method: 'get',
			mode: 'cors',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			}
		});

		const json = await response.json();
		const data = json.data;

		return data;
	} catch (e) {
		console.error(e);
	}
}

export async function post(endpoint) {
	try {
		const response = await fetch(config.api.url + endpoint, {
			method: 'post',
			mode: 'cors',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			}
		});

		const json = await response.json();
		const data = json.data;

		return data;
	} catch (e) {
		console.error(e);
	}
}

export function postLogin(email, password) {
	return axios({
		method: "post",
		url: `${config.apiUrl}/auth/login`,
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		data: {
			email,
			password
		},
		mode: 'cors'
	});
}

export function postLoginGoogle(googleToken) {
	return axios({
		method: "post",
		url: `${config.apiUrl}/auth/login-google`,
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		data: {
			token: googleToken
		},
		mode: 'cors'
	});
}







