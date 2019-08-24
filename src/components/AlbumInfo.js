import React, { Component } from 'react';
import { connect } from "react-redux";

class AlbumInfo extends Component {

	render() {

		const album = this.props.album;

		return (
			<div className="leftMenuItem boxUderline">
				<h3><p className="noWrap"><span>{album.continent} &gt;&gt; {album.name}</span></p></h3>
				<p className="noWrap"><span>{album.month}/{album.year}</span></p>
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
