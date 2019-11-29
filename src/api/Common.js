const { Tags } = require("../constants/index");

function meOrNull(me) {
	return (me || me === 0) ? me : null;
}

function meOrVal(me, val) {
	return (me || me === 0) ? me : val;
}

function formatAlbumName(album) {
	return `${album.name} (${album.month}/${album.year})`;
}

function deleteFromArray(array, item) {
	const index = array.indexOf(item);
	array.splice(index, 1);
}

function setCookie(props, cookieName, cookieValue, cookiePath = "/") {
	const { cookies } = props;
	cookies.set(cookieName, cookieValue, { path: cookiePath });
}

function getPhotoFilterTagsFromCookies(cookies) {

	let tags = cookies.cookies.selectedFilterTags;
	if (tags) {
		tags = JSON.parse(tags);
	} else {
		tags = [Tags.nice.name, Tags.top.name];
	}
	return tags;
}

export {
	meOrNull, meOrVal,
	formatAlbumName, deleteFromArray,
	setCookie, getPhotoFilterTagsFromCookies
};