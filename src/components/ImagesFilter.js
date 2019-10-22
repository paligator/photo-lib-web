import React, { Component } from 'react';
import { connect } from "react-redux";
import * as actions from "../constants/action-types";
import { PhotoTags } from '../components';
import * as C from '../api/Common';
import { Button } from 'reactstrap';

class ImagesFilter extends Component {

	constructor(props) {
		super(props);

		this.filterPhotos = this.filterPhotos.bind(this);

		this.child = React.createRef();
	}

	render() {

		const photoFilterTags = C.getPhotoFilterTagsFromCookies(this.props.cookies);

		return (
			<div className="leftMenuItem boxUderline" >
				<h4>Photo Filter:</h4>
				<PhotoTags mode="multi" showNotTaggedTag={true} ref={this.child} tags={photoFilterTags} saveSelected={true} cookies={this.props.cookies} ></PhotoTags>
				<Button color="link" style={{ paddingLeft: 0 }} onClick={this.filterPhotos}>Filter it</Button>
			</div >
		)
	}

	filterPhotos() {
		const tags = this.child.current.getSelectedTags();
		const album = this.props.selectedAlbum.name;
		console.log(`vybrane tagy ${JSON.stringify(tags)}`);

		this.props.onChangeFilterTags(album, tags);
	}

}

function mapStateToProps(state, ownProps) {
	return {
		cookies: ownProps.cookies,
		selectedAlbum: state.selectedAlbum
	};
}

function mapDispatchToProps(dispatch) {
	return {
		onChangeFilterTags: (albumName, tags) => {
			dispatch({ type: actions.FILTER_ALBUM_PHOTOS, payload: { albumName, tags } });
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ImagesFilter);
