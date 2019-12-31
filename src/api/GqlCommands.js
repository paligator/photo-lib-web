import gql from "graphql-tag";

export const GET_ALBUM = `
	query GetAlbum($albumName: String!, $tags: [String]) {
		album(name: $albumName) {
			continent
			id
			month
			name 
			year
			path
			files
		}
		photosByTags(albumName: $albumName, tags: $tags) {
			tag
			photos
		}
	}
`;
export const GET_ALBUM_GQL = toGql(GET_ALBUM);

export const GET_ALBUM_PHOTOS = `
	query GetPhotosByTags($albumName: String!, $tags: [String]) {
		photosByTags(albumName: $albumName, tags: $tags) {
			tag
			photos
		}
	}
`;
export const GET_ALBUM_PHOTOS_GQL = toGql(GET_ALBUM_PHOTOS);

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

export const GET_PHOTO_DETAILS = `
	query GetPhotoDetails($albumId: ID!, $photoName: String!) {
		photo(albumId: $albumId, photoName: $photoName) {
			tags
			comments { 
        username
        userEmail
				comment
				createDate
				_id
      }
		}
	}
`;
export const GET_PHOTO_DETAILS_GQL = toGql(GET_PHOTO_DETAILS);

export const SET_PHOTO_TAGS = `
	mutation SetPhotoTags($albumId: ID!, $photoName: String!, $addTags: [String]!, $removeTags: [String]!) {
		setPhotoTags(albumId: $albumId, photoName: $photoName, addTags: $addTags, removeTags: $removeTags)
	}
`;
export const SET_PHOTO_TAGS_GQL = toGql(SET_PHOTO_TAGS);

export const ADD_PHOTO_COMMENT = `
	mutation AddPhotoComment($albumId: ID!, $photoName: String!, $comment: String!) {
		addPhotoComment(albumId: $albumId, photoName: $photoName, comment: $comment)
	}
`;
export const ADD_PHOTO_COMMENT_GQL = toGql(ADD_PHOTO_COMMENT);

export const DELETE_PHOTO_COMMENT = `
	mutation DeletePhotoComment($albumId: ID!, $photoName: String!, $commentId: ID!) {
		deletePhotoComment(albumId: $albumId, photoName: $photoName, commentId: $commentId)
	}
`;
export const DELETE_PHOTO_COMMENT_GQL = toGql(DELETE_PHOTO_COMMENT);

function toGql(command) {
	return gql`${command}`;
}