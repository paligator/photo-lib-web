import decode from "jwt-decode";
import rules from "../rbac-rules";

export function isUserLogged() {

	const token = localStorage.getItem('token');

	if (!token) {
		return false;
	}

	let decoded;
	try {
		decoded = decode(token);
	} catch (e) {
		console.error("Invalid token :(");
		return false;
	}

	if (decoded.exp < Date.now() / 1000) {
		return false;
	}

	return true
}

export function isUserNotLogged() {
	return !isUserLogged();
}

/**
 * Takes roles from token, use only if roles are not in state
 */
export function getUserRoles() {

	const token = localStorage.getItem('token');

	if (!token) {
		return [];
	}

	let decoded;
	try {
		decoded = decode(token);
	} catch (e) {
		return [];
	}

	return decoded.roles;
}

export function isAnyUserRoleAllowed(userRoles, action) {
	const allowedRolesForAction = rules[action];
	if (!allowedRolesForAction) {
		return false;
	}

	const can = allowedRolesForAction.some((role) => userRoles.indexOf(role) > -1);

	return (can === true) ? true : allowedRolesForAction.indexOf("superAdmin") > -1;
}
