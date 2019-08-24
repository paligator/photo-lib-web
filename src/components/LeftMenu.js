import React, { Component } from 'react';
import { connect } from "react-redux";

import { ImageDetails, AlbumInfo, ImagesFilter } from "../components";

class LeftMenu extends Component {

	render() {

		return (
			<div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%" }}>
				<AlbumInfo />
				<ImagesFilter cookies={this.props.cookies} />
				<ImageDetails />
			</div>
		)
	}
}

function mapStateToProps(state, ownState) {
	return {
		album: state.selectedAlbum,
		cookies: ownState.cookies
	};
}

// eslint-disable-next-line no-unused-vars
function mapDispatchToProps(dispatch) {
	return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(LeftMenu);
