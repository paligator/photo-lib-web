import * as actions from "../constants/action-types";
import { apolloClient } from '../App';
import { getUserRoles, isUserLogged } from "../api/Authorization"

const initialState = {
	albums: {
		isFetcing: false,
		error: null,
		value: []
	},
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
	selectedPhoto: {
		isFetching: false,
		isReady: false,
		error: null,
		exif: null
	},
	isUserLogged: false,
	unSuccessfulLogin: false,
	userRoles: []
};

export default function rootReducer(state = initialState, inputAction) {

	//	console.log(`rootReducer() ${JSON.stringify(inputAction)}`);

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
	return { ...state, selectedAlbum: { ...state.selectedAlbum, selectedPhotoIndex: parseInt(inputAction.payload.photoIndex) }, selectedPhoto: { isReady: false } };
}

function ACT_PREV_PHOTO(state) {
	const actualIndex = parseInt(state.selectedAlbum.selectedPhotoIndex);
	const selectedPhotoIndex = actualIndex - 1;
	return { ...state, selectedAlbum: { ...state.selectedAlbum, selectedPhotoIndex }, selectedPhoto: { isReady: false } };
}

function ACT_NEXT_PHOTO(state) {
	const actualIndex = parseInt(state.selectedAlbum.selectedPhotoIndex);
	const selectedPhotoIndex = actualIndex + 1;
	return { ...state, selectedAlbum: { ...state.selectedAlbum, selectedPhotoIndex }, selectedPhoto: { isReady: false } };
}

function ACT_INIT_STATE_BY_COOKIES(inputAction, state) {
	const cookies = inputAction.payload.cookies;
	const userRoles = isUserLogged() ? getUserRoles() : {};
	return { ...state, selectedFilterTags: cookies.selectedFilterTags ? JSON.parse(cookies.selectedFilterTags) : [], userRoles };
}

function ACT_RESET_ALBUM(state) {
	return { ...state, selectedAlbum: initialState.selectedAlbum, selectedPhoto: initialState.selectedPhoto };
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
		return { ...state, selectedAlbum: { name: inputAction.payload.albumId, isReady: false, isFetching: true }, selectedPhotoIndex: -1, selectedPhoto: { isReady: false } };
	}
}

function ACT_LOGIN(state, inputAction, actionType) {
	if (actionType === 'SUCCESS') {
		localStorage.setItem("token", inputAction.data);

		return { ...state, isUserLogged: true, userRoles: getUserRoles() };
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
		return { ...state, selectedAlbum: { ...state.selectedAlbum, isReloadingPhotos: true }, selectedPhotoIndex: -1, selectedPhoto: { isReady: false } };
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