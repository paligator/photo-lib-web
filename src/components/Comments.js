import React, { useRef, useState } from 'react';
import { Mutation } from 'react-apollo';

import * as gqlCommands from '../api/GqlCommands';
import { useSelector } from "react-redux";
import { Input, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import * as C from "../api/Common";
import { Query } from "react-apollo";
import { getUserName } from "../api/Authorization";

const Comments = () => {

	const node = useRef();
	const album = useSelector(state => state.selectedAlbum);
	const albumId = (album) ? album.id : null;
	const selectedPhotoIndex = album.selectedPhotoIndex;
	const photoName = selectedPhotoIndex > -1 ? album.files[selectedPhotoIndex] : "";
	const [modalAskToDelete, setModalAskToDeleteComment] = useState({ show: false, text: "???" });

	function addComment(callback) {
		const txtNewComment = node.current.querySelector("#txtNewComment");
		const comment = txtNewComment.value;
		callback({ variables: { albumId, photoName, comment } });
		txtNewComment.value = "";
	}

	function deleteComment(callback) {
		hideModalAskToDelete();
		callback({ variables: { albumId, photoName, commentId: modalAskToDelete.commentId } })
	}

	function hideModalAskToDelete() {
		setModalAskToDeleteComment({ show: false });
	}

	function showModalAskToDelete(comment) {
		setModalAskToDeleteComment({ show: true, text: comment.comment, commentId: comment._id });
	}
	
	const ExistsComments = (props) => {

		const photo = props.photo;
		const comments = ((photo && photo.comments) || []).sort((a, b) => { return new Date(a.createDate) - new Date(b.createDate) });
		const username = getUserName();

		return (
			comments.map((comment, i) => {
				return (
					<div key={i} className="comment">
						<strong>{comment.username}</strong> | {C.formatDate(comment.createDate)}{' '}
						{(username === comment.username) ?
							(<i className="fa fa-times" aria-hidden="true" title="Delete" onClick={() => showModalAskToDelete(comment)} />)
							:
							null
						}
						<br />{comment.comment}
					</div>)
			})
		);
	};

	const ModalComponentToAskDelete = () => {
		return (
			<Modal isOpen={modalAskToDelete.show} toggle={hideModalAskToDelete} className="">
				<ModalHeader toggle={hideModalAskToDelete}>Are yo sure you want delete comment?</ModalHeader>
				<ModalBody>
					{modalAskToDelete.text}
				</ModalBody>
				<ModalFooter>

					<Mutation
						mutation={gqlCommands.DELETE_PHOTO_COMMENT_GQL}
						refetchQueries={[{ query: gqlCommands.GET_PHOTO_DETAILS_GQL, variables: { albumId, photoName } }]}
						fetchPolicy="no-cache">

						{(callback) => {
							return (
								<React.Fragment>
									<Button className="btn-danger" onClick={() => { deleteComment(callback) }} >Delete</Button>{' '}
								</React.Fragment>
							);
						}}
					</Mutation>

					<Button className="btn-primary" onClick={hideModalAskToDelete}>Cancel</Button>
				</ModalFooter>
			</Modal>
		)
	};

	const ButtonToAddComment = () => {
		return (
			<Mutation
				mutation={gqlCommands.ADD_PHOTO_COMMENT_GQL}
				refetchQueries={[{ query: gqlCommands.GET_PHOTO_DETAILS_GQL, variables: { albumId, photoName } }]}
				fetchPolicy="no-cache"
			>
				{(callback) => {
					return (
						<Button className="btn-primary leftMenuItem" onClick={() => { addComment(callback) }}>Add</Button>
					)
				}}
			</Mutation>
		)
	};

	if (!albumId || !photoName) {
		return null;
	}
	
	return (
		<div className="leftMenuItem" ref={node}>
			<Query query={gqlCommands.GET_PHOTO_DETAILS_GQL} variables={{ albumId, photoName }} fetchPolicy="cache-and-network">
				{({ data }) => {
					const photo = (data && data.photo) || {};
					return (
						<div>
							<h4>Comments:</h4>
							<Input id="txtNewComment" type="textarea" maxLength="300" placeholder="Leave your comment here..." />
							<ButtonToAddComment /><br />
							<ExistsComments photo={photo} />
						</div>
					);
				}}
			</Query>
			<ModalComponentToAskDelete />
		</div>
	);

}

export default Comments;