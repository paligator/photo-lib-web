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
		tags = ["nice", "top"];
	}
	return tags;
}

function findNextFavourite(album, currentIndex) {
	const { files, favourites } = album;
	for (let i = currentIndex + 1; i < files.length; i++) {
		if (favourites.indexOf(files[i]) > -1) {
			return i;
		}
	}
}

function findPrevFavourite(album, currentIndex) {
	const { files, favourites } = album;
	for (let i = currentIndex - 1; i >= 0; i--) {
		if (favourites.indexOf(files[i]) > -1) {
			return i;
		}
	}
}

function findLastFavouriteIndex(album) {
	const { files, favourites } = album;
	for (let i = favourites.length - 1; i >= 0; i--) {
		if (files.indexOf(favourites[i]) > -1) {
			return files.indexOf(favourites[i]);
		}
	}

	return -1;
}

function findFirstFavouriteIndex(album) {
	const { files, favourites } = album;
	for (let i = 0; i < favourites.length; i++) {
		if (files.indexOf(favourites[i]) > -1) {
			return files.indexOf(favourites[i]);
		}
	}

	return -1;
}

module.exports = {
	meOrNull, meOrVal,
	formatAlbumName, deleteFromArray, 
	setCookie, getPhotoFilterTagsFromCookies,
	findNextFavourite, findPrevFavourite, findLastFavouriteIndex, findFirstFavouriteIndex,
};