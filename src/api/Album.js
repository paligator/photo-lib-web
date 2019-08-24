import axios from "axios";
import config from '../config';

export function getAlbum(albumName) {
	throw new Error(`Method getAlbum is not implemented ${albumName}`);
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

// function axiosForGraphQl(query, variables) {
// 	return axios({
// 		method: "post",
// 		url: `${config.apiUrl}/graphql`,
// 		headers: {
// 			Accept: 'application/json',
// 			'Content-Type': 'application/json'
// 		},
// 		mode: 'cors',
// 		data: {
// 			query: query,
// 			variables: variables
// 		}
// 	});
// }

