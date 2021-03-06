import local from './local';
// import dev from './dev';
// import stage from './stage';
import prod from './production';

let apiUrl = local.apiUrl;
let imageProxyUrl = local.imageProxyUrl;
let apiGraphQLUrl = local.apiGraphQLUrl;

console.log("I'm in........: " + process.env.REACT_APP_ENV);

// if (process.env.REACT_APP_ENV === 'dev') {
// 	apiUrl = dev.apiUrl;
// }

// if (process.env.REACT_APP_ENV === 'stage') {
// 	apiUrl = stage.apiUrl;
// }

if (process.env.REACT_APP_ENV === 'production') {
	apiUrl = prod.apiUrl;
	imageProxyUrl = prod.imageProxyUrl;
	apiGraphQLUrl = prod.apiGraphQLUrl;
}


const config = {
	apiUrl,
	imageProxyUrl,
	apiGraphQLUrl,
	categories: ['America', 'Africa', 'Asia', 'Europe', 'Antarctica', 'Australia', 'Slovakia']
}


export default {
	...config
};