import React, { Component } from 'react';
import { connect } from "react-redux";
import gql from "graphql-tag";
import { Mutation } from 'react-apollo';

import * as gqlCommands from '../api/GqlCommands';
import { Can, PhotoTags } from "../components";
import { Query } from "react-apollo";

class ImageDetails extends Component {

	shouldComponentUpdate(nextProps) {
		return (nextProps.album) ? true : false;
	}

	render() {

		const album = this.props.album;
		const albumId = (album) ? album.id : null;
		const selectedPhotoIndex = album.selectedPhotoIndex;
		const photoName = selectedPhotoIndex > -1 ? album.files[selectedPhotoIndex] : "";

		return (<div className="leftMenuItem">

			{(!photoName) ? null : (

				<React.Fragment>
					<h4>Photo details:</h4>

					<Query query={gqlCommands.GET_PHOTO_DETAILS_GQL} variables={{ albumId, photoName }} fetchPolicy="cache-and-network">
						{({ loading, data }) => {

							if (loading === true || !data) {
								return <div />;
							}

							const photo = data.photo || {};
							const tags = photo.tags || [];

							return (<div>

								<p>
									Name:<br />
									<span>{photoName}</span>
								</p>
								<Can perform="photo:setPhotoTags" yes={() => (
									<Mutation
										mutation={gql`${gqlCommands.SET_PHOTO_TAGS}`}
										refetchQueries={[{ query: "Photo", variables: { albumId, photoName } }]}
										fetchPolicy="no-cache"
									>
										{(updateTags) => {
											return (
												<div>
													Tags:<br />
													<PhotoTags albumId={album.id} photoName={photoName} tags={tags} updateTags={updateTags} />
												</div>
											);
										}}
									</Mutation>
								)} no={() => (<PhotoTags albumId={album.id} photoName={photoName} tags={tags} disabled={true}></PhotoTags>)} />
							</div>
							);
						}}
					</Query>
				</React.Fragment>
			)}

		</div >
		);
	}
}

function mapStateToProps(state) {

	const album = state.selectedAlbum || null;

	const retVal = {
		album,
	};

	return retVal;
}


// eslint-disable-next-line no-unused-vars
function mapDispatchToProps(dispatch) {
	return {

	};
}

export default connect(mapStateToProps, mapDispatchToProps)(ImageDetails);
