import gql from "graphql-tag";

export const GET_ALBUM = `
	query GetAlbum($albumName: String!) {
		album(name: $albumName) {
			continent
			favourites
			id
			month
			name 
			year
			url
			files
		}
	}
`;
export const GET_ALBUM_GQL = toGql(GET_ALBUM);

export const GET_ALL_ALBUMS = `
	query GetAllAlbums {
		albums {
			continent
			year
			month
			name
			id
			countries
		}
	}
`;
export const GET_ALL_ALBUMS_GQL = toGql(GET_ALL_ALBUMS);

export const GET_EXIF = `
	query GetExif($albumId: ID!, $photoName: String!) {
		exif(albumId: $albumId, photoName: $photoName) {
			createDate
			orientation
			camera
		}
	}
`
export const GET_EXIF_GQL = toGql(GET_EXIF);

export const GET_EXIF_AND_ALBUM = `
	query GetExifAndAlbum($albumId: ID!, $photoName: String!) {
		exif(albumId: $albumId, photoName: $photoName) {
			createDate
			orientation
			camera
		}
		album(id: $albumId) {
			favourites
			id
			name
		}
	}
`
export const GET_EXIF_AND_ALBUM_GQL = toGql(GET_EXIF_AND_ALBUM);

export const SET_PHOTO_AS_FAVOURITE = `
	mutation SetPhotoFavourite($albumId: ID!, $photoName: String!, $status: Boolean!) {
		setPhotoFavourite(albumId: $albumId, photoName: $photoName, status: $status)
	}
`;

function toGql(command) {
	return gql`${command}`;
}