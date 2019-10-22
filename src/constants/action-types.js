export const GET_ALBUM = "GET_ALBUM_REQUEST";
export const RESET_ALBUM = "RESET_ALBUM";
export const FILTER_ALBUM_PHOTOS = "FILTER_ALBUM_PHOTOS_REQUEST";

export const CHOOSE_PHOTO_INDEX = "CHOOSE_PHOTO_INDEX";
export const CHANGE_FILTER_TAGS = "CHANGE_FILTER_TAGS";
export const INIT_STATE_BY_COOKIES = "INIT_STATE_BY_COOKIES";

export const LOGIN = "LOGIN_REQUEST";
export const LOGOUT = "LOGOUT";

export const NEXT_PHOTO = "NEXT_PHOTO";
export const PREV_PHOTO = "PREV_PHOTO";

export function toSuccessAction(action) {
	return action + '_SUCCESS';
}

export function toErrorAction(action) {
	return action + '_ERROR';
}
