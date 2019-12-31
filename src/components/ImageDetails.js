import React, { useRef } from 'react';
import { Mutation } from 'react-apollo';

import * as gqlCommands from '../api/GqlCommands';
import { Can, PhotoTags } from "../components";
import { Query } from "react-apollo";
import { useSelector } from "react-redux";

const ImageDetails = (props) => {

	const node = useRef();

	const album = useSelector(state => state.selectedAlbum);
	const albumId = (album) ? album.id : null;
	const selectedPhotoIndex = album.selectedPhotoIndex;
	const photoName = selectedPhotoIndex > -1 ? album.files[selectedPhotoIndex] : "";

	const SetPhotoTags = (props) => {
		const tags = props.tags;
		return (
			<Can perform="photo:setPhotoTags" yes={() => (
				<Mutation
					mutation={gqlCommands.SET_PHOTO_TAGS_GQL}
					refetchQueries={[{ query: gqlCommands.GET_PHOTO_DETAILS_GQL, variables: { albumId, photoName } }]}
					fetchPolicy="no-cache"
				>
					{(updateTags) => {
						return (
							<div className="boxUderline">
								Tags:<br />
								<PhotoTags albumId={album.id} photoName={photoName} tags={tags} updateTags={updateTags} markThumbWithTag={props.markThumbWithTag} />
							</div>
						);
					}}
				</Mutation>
			)} no={() => (<PhotoTags albumId={album.id} photoName={photoName} tags={tags} disabled={true}></PhotoTags>)} />
		);
	}

	return (
		<div className="leftMenuItem" ref={node}>
			<h4>Photo details:</h4>

			{(!photoName) ? null : (
				<Query query={gqlCommands.GET_PHOTO_DETAILS_GQL} variables={{ albumId, photoName }} fetchPolicy="cache-and-network">
					{({ data }) => {

						const photo = (data && data.photo) || {};
						const tags = (photo && photo.tags) || [];

						return (<div>
							<p>
								Name:<br />
								<span>{photoName}</span>
							</p>
							<SetPhotoTags tags={tags} markThumbWithTag={props.markThumbWithTag} />
						</div>
						);
					}}
				</Query>
			)}
		</div >
	);
}

export default ImageDetails;