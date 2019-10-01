import React, { Component } from 'react';
import { connect } from "react-redux";
import * as C from '../api/Common';
import gql from "graphql-tag";
import { Mutation } from 'react-apollo';
import * as gqlCommands from '../api/GqlCommands';
import * as actions from "../constants/action-types";
import { Can, FavouriteBtn } from "../components";

class ImageDetails extends Component {

	shouldComponentUpdate(nextProps) {
		return (nextProps.album) ? true : false;
	}

	render() {

		const album = this.props.album;
		const photo = this.props.photo;
		const exif = (photo && photo.exif) ? photo.exif : {};
		const selectedPhotoIndex = album.selectedPhotoIndex;
		const photoName = selectedPhotoIndex > -1 ? album.files[selectedPhotoIndex] : "";
		const isFavourite = selectedPhotoIndex > -1 ? album.favourites.indexOf(photoName) > -1 : false;

		return (<div className="leftMenuItem">
			<div className="boxUderline">
				<h4>Photo details:</h4>
				<p>
					Name:<br />
					<span>{photoName}</span>
				</p>
				<p>
					<Can perform="photo:setFavourite" yes={() => (
						<Mutation
							mutation={gql`${gqlCommands.SET_PHOTO_AS_FAVOURITE}`}
							update={(cache) => {
								const cachedAlbum = cache.readQuery({ query: gqlCommands.GET_ALBUM_GQL, variables: { albumName: album.name } }).album;

								if (cachedAlbum.favourites.indexOf(photoName) > -1) {
									C.deleteFromArray(cachedAlbum.favourites, photoName);
								} else {
									cachedAlbum.favourites.push(photoName);
								}

								this.props.onUpdateFavourites(cachedAlbum.favourites);

								cache.writeQuery({
									query: gqlCommands.GET_ALBUM_GQL,
									data: { cachedAlbum }
								});
							}}
						>
							{(setAsFavouritePhoto) => {
								return (
									<React.Fragment>
										Is my favourite:<br />
										<span><FavouriteBtn isFavourite={isFavourite} onClick={() => { setAsFavouritePhoto({ variables: { albumId: album.id, photoName, status: !isFavourite } }) }}></FavouriteBtn></span>
									</React.Fragment>
								)
							}}
						</Mutation>
					)} no={() => (<FavouriteBtn isFavourite={isFavourite} disabled></FavouriteBtn>)} />
				</p>
			</div>
			<div className="leftMenuItem" style={{ height: "400px", overflow: "auto" }}>
				<h4>Exif:</h4>
				<div>
					{(exif) ? (
						Object.keys(exif).map(item => {

							let value = exif[item];
							console.log(`item ${item} -> ${value}`);
							value = String(value);
							return (
								<React.Fragment key={item}>
									<p>{item}<br />
										<span>{value}</span>
									</p>
								</React.Fragment>
							)
						})) : null}

				</div>


			</div>
		</div>
		)
	}
}

function mapStateToProps(state) {

	const album = state.selectedAlbum || null;
	const photo = state.selectedPhoto || null;

	const retVal = {
		album,
		photo
	};

	return retVal;
}

// eslint-disable-next-line no-unused-vars
function mapDispatchToProps(dispatch) {
	return {
		onUpdateFavourites: (favourites) => {
			dispatch({ type: actions.SYNC_FAVOURITES, payload: { favourites } });
		},
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(ImageDetails);
