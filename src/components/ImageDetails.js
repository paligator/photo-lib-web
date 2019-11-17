import React from 'react';
import gql from "graphql-tag";
import { Mutation } from 'react-apollo';

import * as gqlCommands from '../api/GqlCommands';
import { Can, PhotoTags } from "../components";
import { Query } from "react-apollo";
import { useSelector } from "react-redux";

const ImageDetails = () => {

	const album = useSelector(state => state.selectedAlbum);
	const albumId = (album) ? album.id : null;
	const selectedPhotoIndex = album.selectedPhotoIndex;
	const photoName = selectedPhotoIndex > -1 ? album.files[selectedPhotoIndex] : "";

	return (<div className="leftMenuItem">
		<h4>Photo details:</h4>

		{(!photoName) ? null : (

			<React.Fragment>

				<Query query={gqlCommands.GET_PHOTO_DETAILS_GQL} variables={{ albumId, photoName }} fetchPolicy="cache-and-network">
					{({ data }) => {

						const photo = (data && data.photo) || {};
						const tags = (photo && photo.tags) || [];

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

export default ImageDetails;