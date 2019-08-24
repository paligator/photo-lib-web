import React, { Component } from 'react';
import { connect } from "react-redux";
import * as actions from "../constants/action-types";
import config from '../config';
import * as C from "../api/Common";

class Thumbs extends Component {

	constructor(props) {
		super(props);
		this.chooseThumb = this.chooseThumb.bind(this);
	}

	render() {

		const thumbUrl = `${config.imageProxyUrl}/photo/thumb${this.props.urlPath}`;
		const files = this.props.album.files;
		const curIndex = this.props.selectedPhotoIndex;

		return (
			<div ref={node => this.node = node} id="divThumbs" className="flexRow" style={{ maxWidth: "100%", width: "100%", height: "85px", minHeight: "85px" }}>
				{
					files.map((file, i) => {
						return (
							<img id={`imgThumb_${i}`} className={(i === curIndex) ? "thumb thumbSelected" : "thumb"}
								key={file} alt="error"
								data-index={i} onClick={this.chooseThumb} src={`${thumbUrl}/${file}`}></img>
						)
					})
				}
			</div>
		);
	}

	chooseThumb(e) {
		console.log('thumbClick: ' + e.target.dataset.index);
		this.props.onChooseThumb(e.target.dataset.index, this.node);
		this.props.markThumbAsSelected(e.target, this.node, false);
	}
}

function mapStateToProps(state) {
	return {
		album: state.selectedAlbum,
		selectedPhotoIndex: C.meOrVal(state.selectedAlbum.selectedPhotoIndex, -1),
	};
}

function mapDispatchToProps(dispatch) {
	return {
		onChooseThumb: (photoIndex) => {
			dispatch({ type: actions.CHOOSE_PHOTO_INDEX, payload: { photoIndex } });
		},
	};
}


export default connect(mapStateToProps, mapDispatchToProps)(Thumbs);
