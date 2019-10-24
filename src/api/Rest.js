import config from '../config';

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







