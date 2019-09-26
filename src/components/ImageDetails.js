import React, { Component } from 'react';
import { connect } from "react-redux";
import * as C from '../api/Common';
import gql from "graphql-tag";
import { Query, Mutation } from 'react-apollo';
import * as gqlCommands from '../api/GqlCommands';
import * as actions from "../constants/action-types";
import { Can, FavouriteBtn } from "../components";

class ImageDetails extends Component {

	shouldComponentUpdate(nextProps) {
		return (nextProps.albumId) ? true : false;
	}

	render() {

		const albumId = this.props.albumId;
		const photoName = this.props.photoName;
		const albumName = this.props.albumName;

		if (!albumId)
			return <div></div>

		return (
			<Query query={gqlCommands.GET_EXIF_AND_ALBUM_GQL} variables={{ albumId, photoName }}	>
				{({ loading, data }) => {
					const exif = C.meOrVal((data) ? data.exif : data, {});
					const album = C.meOrVal((data) ? data.album : data, {});
					const isFavourite = (loading) ? false : album.favourites.indexOf(photoName) > -1;

					return (<div className="leftMenuItem">
						<div className="boxUderline">
							<h4>Photo details:</h4>
							<p>
								Name:<br />
								<span>{this.props.photoName}</span>
							</p>
							<p>

								<Can perform="photo:setFavourite" yes={() => (
									<Mutation
										mutation={gql`${gqlCommands.SET_PHOTO_AS_FAVOURITE}`}
										update={(cache) => {
											const album = cache.readQuery({ query: gqlCommands.GET_ALBUM_GQL, variables: { albumName: albumName } }).album;

											if (album.favourites.indexOf(photoName) > -1) {
												C.deleteFromArray(album.favourites, photoName);
											} else {
												album.favourites.push(photoName);
											}

											this.props.onUpdateFavourites(album.favourites);

											cache.writeQuery({
												query: gqlCommands.GET_ALBUM_GQL,
												data: { album }
											});
										}}
									>
										{(setAsFavouritePhoto) => {
											return (
												<React.Fragment>
													Is my favourite:<br />
													<span><FavouriteBtn isFavourite={isFavourite} onClick={() => { setAsFavouritePhoto({ variables: { albumId, photoName, status: !isFavourite } }) }}></FavouriteBtn></span>
												</React.Fragment>
											)
										}}
									</Mutation>
								)} no={() => (<FavouriteBtn isFavourite={isFavourite} disabled></FavouriteBtn>)} />


							</p>
						</div>
						<div className="leftMenuItem">
							<h4>Exif:</h4>
							<p>
								Camera:<br />
								<span>{exif.camera}</span>
							</p>
							<p>
								Orientation:<br />
								<span>{exif.orientation || "-"}</span>
							</p>
						</div>
					</div >
					)
				}}

			</Query>
		)
		//}
	}
}

function mapStateToProps(state) {

	const album = (state.selectedAlbum) ? state.selectedAlbum : null;
	const selectedPhotoIndex = state.selectedAlbum.selectedPhotoIndex;
	let photoName = "";
	let albumId = null;
	let albumName = null;

	if (album.isReady === true) {
		photoName = album.files[selectedPhotoIndex];
		albumName = album.name;

		albumId = album.id;
	}

	const retVal = {
		photoName: photoName,
		albumId: albumId,
		albumName: albumName
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
