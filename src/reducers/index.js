import * as actions from "../constants/action-types";
import * as C from "../api/Common";
import { apolloClient } from '../App';
import { getUserRoles, isUserLogged } from "../api/Authorization"

const initialState = {
	showOriginals: false,
	showOnlyFavourites: false,
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
		selectedPhotoIndex: -1
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
		case actions.CHANGE_SHOW_ORIGINALS:
			return ACT_CHANGE_SHOW_ORIGINALS(state, inputAction);
		case actions.CHANGE_SHOW_ONLY_FAVOURITES:
			return ACT_CHANGE_SHOW_ONLY_FAVOURITES(state, inputAction);
		case actions.RESET_ALBUM:
			return ACT_RESET_ALBUM(state);
		case actions.GET_ALBUM:
			return ACT_GET_ALBUM(state, inputAction, actionType)
		case actions.SYNC_FAVOURITES:
			return ACT_SYNC_FAVOURITES(state, inputAction)
		case actions.LOGIN:
			return ACT_LOGIN(state, inputAction, actionType);
		case actions.LOGOUT:
			return ACT_LOGOUT(state);
		case actions.LOAD_EXIF:
			return ACT_GET_EXIF(state, inputAction);
		default:

			//TODO: This is probably antipattern. When Redux initializes it dispatches a "dummy" action to fill the state
			if (action.startsWith('@@')) {
				return state;
			}
			console.error(`Reducer action '${action}' is not threated!!!`);
	}

	return state;
}

function ACT_SYNC_FAVOURITES(state, inputAction) {
	return { ...state, selectedAlbum: { ...state.selectedAlbum, favourites: inputAction.payload.favourites } };
}

function ACT_CHANGE_SHOW_ONLY_FAVOURITES(state, inputAction) {
	return { ...state, showOnlyFavourites: inputAction.payload.onlyFavourites };
}

function ACT_CHANGE_SHOW_ORIGINALS(state, inputAction) {
	return { ...state, showOriginals: inputAction.payload.status };
}

function ACT_CHOOSE_PHOTO_INDEX(state, inputAction) {
	return { ...state, selectedAlbum: { ...state.selectedAlbum, selectedPhotoIndex: parseInt(inputAction.payload.photoIndex) }, selectedPhoto: { isReady: false } };
}

function ACT_PREV_PHOTO(state) {
	const actualIndex = parseInt(state.selectedAlbum.selectedPhotoIndex);
	const selectedPhotoIndex = (state.showOnlyFavourites) ? C.findPrevFavourite(state.selectedAlbum, actualIndex) : (actualIndex - 1);
	return { ...state, selectedAlbum: { ...state.selectedAlbum, selectedPhotoIndex }, selectedPhoto: { isReady: false } };
}

function ACT_NEXT_PHOTO(state) {
	const actualIndex = parseInt(state.selectedAlbum.selectedPhotoIndex);
	const selectedPhotoIndex = (state.showOnlyFavourites) ? C.findNextFavourite(state.selectedAlbum, actualIndex) : (actualIndex + 1);
	return { ...state, selectedAlbum: { ...state.selectedAlbum, selectedPhotoIndex }, selectedPhoto: { isReady: false } };
}

function ACT_INIT_STATE_BY_COOKIES(inputAction, state) {
	const cookies = inputAction.payload.cookies;
	const userRoles = isUserLogged() ? getUserRoles() : {};
	return { ...state, showOnlyFavourites: cookies.showOnlyFavourites === "true", showOriginals: cookies.showOriginals === "true", userRoles };
}

function ACT_RESET_ALBUM(state) {
	return { ...state, selectedAlbum: initialState.selectedAlbum, selectedPhoto: initialState.selectedPhoto };
}

function ACT_GET_ALBUM(state, inputAction, actionType) {
	if (actionType === 'SUCCESS') {
		const initIndex = (state.showOnlyFavourites) ? C.findNextFavourite(inputAction.data, -1) : 0;

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

function ACT_GET_EXIF(state, inputAction) {
	return { ...state, selectedPhoto: { ...state.selectedPhoto, exif: inputAction.payload.exif } };
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