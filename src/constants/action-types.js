export const GET_ALBUM = "GET_ALBUM_REQUEST";
export const RESET_ALBUM = "RESET_ALBUM";

export const NEXT_PHOTO = "NEXT_PHOTO";
export const PREV_PHOTO = "PREV_PHOTO";

export const CHOOSE_PHOTO_INDEX = "CHOOSE_PHOTO_INDEX";


export const CHANGE_SHOW_ORIGINALS = "CHANGE_SHOW_ORIGINALS";
export const CHANGE_SHOW_ONLY_FAVOURITES = "CHANGE_SHOW_ONLY_FAVOURITES";

export const INIT_STATE_BY_COOKIES = "INIT_STATE_BY_COOKIES";

export const SYNC_FAVOURITES = "SYNC_FAVOURITES";

export const LOGIN = "LOGIN_REQUEST";
export const LOGOUT = "LOGOUT";


export function toSuccessAction(action) {
	return action + '_SUCCESS';
}

export function toErrorAction(action) {
	return action + '_ERROR';
}
