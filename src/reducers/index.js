import * as actions from "../constants/action-types";
import { apolloClient } from '../App';
import { getUserRoles, isUserLogged } from "../api/Authorization"

const initialState = {
	selectedAlbum: {
		id: null,
		exists: true,
		name: null,
		isFetcing: false,
		error: null,
		selectedPhotoIndex: -1,
		isReloadingPhotos: false,
		files: []
	},
	userRoles: [],
	token: null
};

export default function rootReducer(state = initialState, inputAction) {

	const parsedAction = parseAction(inputAction);
	const action = parsedAction.action
	const actionType = parsedAction.type


	//TODO DO IT BETTER, so long so ugly
	switch (action) {
		case actions.INIT_STATE_BY_COOKIES:
			return ACT_INIT_STATE_BY_COOKIES(inputAction, state);
		case actions.NEXT_PHOTO:
			return ACT_NEXT_PHOTO(state);
		case actions.PREV_PHOTO:
			return ACT_PREV_PHOTO(state);
		case actions.CHOOSE_PHOTO_INDEX:
			return ACT_CHOOSE_PHOTO_INDEX(state, inputAction);
		case actions.RESET_ALBUM:
			return ACT_RESET_ALBUM(state);
		case actions.GET_ALBUM:
			return ACT_GET_ALBUM(state, inputAction, actionType)
		case actions.LOGIN:
			return ACT_LOGIN(state, inputAction, actionType);
		case actions.LOGIN_GOOGLE: 
			return ACT_LOGIN_GOOGLE(state, inputAction, actionType);
		case actions.LOGOUT:
			return ACT_LOGOUT(state);
		case actions.FILTER_ALBUM_PHOTOS:
			return FILTER_ALBUM_PHOTOS(state, inputAction, actionType)
		default:

			//TODO: This is probably antipattern. When Redux initializes it dispatches a "dummy" action to fill the state
			if (action.startsWith('@@')) {
				return state;
			}
			console.error(`Reducer action '${action}' is not threated!!!`);
	}

	return state;
}

function ACT_CHOOSE_PHOTO_INDEX(state, inputAction) {
	return { ...state, selectedAlbum: { ...state.selectedAlbum, selectedPhotoIndex: parseInt(inputAction.payload.photoIndex) } };
}

function ACT_PREV_PHOTO(state) {
	const actualIndex = parseInt(state.selectedAlbum.selectedPhotoIndex);
	const selectedPhotoIndex = actualIndex - 1;
	return { ...state, selectedAlbum: { ...state.selectedAlbum, selectedPhotoIndex } };
}

function ACT_NEXT_PHOTO(state) {
	const actualIndex = parseInt(state.selectedAlbum.selectedPhotoIndex);
	const selectedPhotoIndex = actualIndex + 1;
	return { ...state, selectedAlbum: { ...state.selectedAlbum, selectedPhotoIndex } };
}

function ACT_INIT_STATE_BY_COOKIES(inputAction, state) {
	const userRoles = isUserLogged() ? getUserRoles() : {};
	return { ...state, userRoles };
}

function ACT_RESET_ALBUM(state) {
	return { ...state, selectedAlbum: initialState.selectedAlbum };
}

function ACT_GET_ALBUM(state, inputAction, actionType) {
	
	if (actionType === 'SUCCESS') {
		const initIndex = 0;

		return { ...state, selectedAlbum: { ...inputAction.data, exists: true, isReady: true, isFetching: false, error: null, selectedPhotoIndex: initIndex } };
	} else if (actionType === 'ERROR') {
		if (inputAction.error && inputAction.error.message.startsWith("GraphQL error: E001")) {
			return { ...state, selectedAlbum: { name: -1, exists: false, isReady: true, isFetching: false, error: inputAction.error } };
		} else {
			return { ...state, selectedAlbum: { name: -1, exists: true, isReady: true, isFetching: false, error: inputAction.error } };
		}

	} else if (actionType === 'REQUEST') {
		return { ...state, selectedAlbum: { name: inputAction.payload.albumId, isReady: false, isFetching: true,  selectedPhotoIndex: -1 } };
	}
}

function ACT_LOGIN(state, inputAction, actionType) {
	if (actionType === 'SUCCESS') {
		const token = inputAction.data;
		localStorage.setItem("token", token);

		return { ...state, userRoles: getUserRoles(), token: token};
	} if (actionType === 'REQUEST') {
		//FIXME: do it normal, some stages, not true/false/XXX
		return { ...initialState, unSuccessfulLogin: 'XXX' };
	} else {
		localStorage.removeItem("token");
		return { ...initialState, unSuccessfulLogin: true };
	}
}

function ACT_LOGIN_GOOGLE(state, inputAction, actionType) {
	if (actionType === 'SUCCESS') {
		const token = inputAction.data;
		localStorage.setItem("token", token);

		return { ...state, userRoles: getUserRoles(), token: token };
	} if (actionType === 'REQUEST') {
		//FIXME: do it normal, some stages, not true/false/XXX
		return { ...initialState, unSuccessfulLogin: 'XXX' };
	} else {
		localStorage.removeItem("token");
		return { ...initialState, unSuccessfulLogin: true };
	}
}

// eslint-disable-next-line no-unused-vars
function ACT_LOGOUT(state) {
	localStorage.removeItem("token");
	apolloClient.resetStore();
	return initialState;
}

function FILTER_ALBUM_PHOTOS(state, inputAction, actionType) {
	if (actionType === 'SUCCESS') {
		const initIndex =  0;

		return { ...state, selectedAlbum: { ...state.selectedAlbum, isReloadingPhotos: false, files: inputAction.data, selectedPhotoIndex: initIndex } };
	} else if (actionType === 'ERROR') {
		return { ...state, selectedAlbum: { ...state.selectedAlbum, files:[], error: inputAction.error } };
	} else if (actionType === 'REQUEST') {
		return { ...state, selectedAlbum: { ...state.selectedAlbum, isReloadingPhotos: true }, selectedPhotoIndex: -1 };
	}
}

function parseAction(inputAction) {
	const tmp = inputAction.type;
	let retVal = null;

	if (tmp.endsWith('_SUCCESS')) {
		retVal = {
			action: tmp.substring(0, tmp.length - 8),
			type: 'SUCCESS'
		}
	} else if (tmp.endsWith('_ERROR')) {
		retVal = {
			action: tmp.substring(0, tmp.length - 6),
			type: 'ERROR'
		}
	} else if (tmp.endsWith('_REQUEST')) {
		retVal = {
			action: tmp,
			type: 'REQUEST'
		}
	} else {
		retVal = {
			action: tmp
		}
	}

	return retVal;

}