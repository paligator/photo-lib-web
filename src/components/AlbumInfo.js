import React, { Component } from 'react';
import { connect } from "react-redux";

class AlbumInfo extends Component {

	render() {

		const album = this.props.album;

		return (
			<div className="leftMenuItem boxUderline">
				<h1 style={{ overflowWrap: "break-word" }}>{album.name}</h1>
				<p>{album.month}/{album.year}</p>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		album: state.selectedAlbum,
	};
}

// eslint-disable-next-line no-unused-vars
function mapDispatchToProps(dispatch) {
	return {
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(AlbumInfo);
