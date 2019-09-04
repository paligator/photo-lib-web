import React, { Component } from 'react';
import { connect } from "react-redux";
import Observer from 'react-intersection-observer'
import * as actions from "../constants/action-types";
import config from '../config';
import * as C from "../api/Common";

class Thumbs extends Component {

	state = {};

	constructor(props) {
		super(props);
		this.chooseThumb = this.chooseThumb.bind(this);
		this.onVisible = this.onVisible.bind(this);
	}


	render() {

		const thumbUrl = `${config.imageProxyUrl}/photo/thumb${this.props.urlPath}`;
		const files = this.props.album.files;
		const curIndex = this.props.selectedPhotoIndex;

		this._isRendered = true;

		console.log('Thumbssssssss -> render()');
		return (

			<div ref={node => this.node = node} id="divThumbs" className="flexRow" style={{ maxWidth: "100%", width: "100%", height: "85px", minHeight: "85px" }}>

				{
					files.map((file, i) => {
						const key = `thumb${i}`;
						const url = `${thumbUrl}/${file}`;
						return (
							<Observer key={key} data-key={key} triggerOnce={false} onChange={this.onVisible} >
								<img id={`imgThumb_${i}`} className={(i === curIndex) ? "thumb thumbSelected" : "thumb"}
									alt="error"
									data-index={i} onClick={this.chooseThumb}
									src="http://localhost:8888/photo/thumb/ethiopia/2019-04-14__16-21-22__0039.JPG"
									data-loaded={false}
									data-src={url}></img>
							</Observer>
						)
					})
				}
			</div>

		);
	}

	onVisible(inView, entry) {

		console.log(`onVisible entry ${entry.target.dataset.key} inView: ${inView}`);

		const image = entry.target.children[0];

		if (inView === true && image.dataset.loaded === "false" && image.dataset.index > 10) {
			return;
		}

		if (image.dataset.loaded === "false") {
			image.dataset.loaded = true;
		}

		if (inView === true && image.src === 'http://localhost:8888/photo/thumb/ethiopia/2019-04-14__16-21-22__0039.JPG') {
			image.src = image.dataset.src;
		}

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
