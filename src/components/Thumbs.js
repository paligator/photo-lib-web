import React, { Component } from 'react';
import { connect } from "react-redux";
import { InView } from 'react-intersection-observer'
import * as actions from "../constants/action-types";
import config from '../config';
import * as C from "../api/Common";
import emptyImage from '../images/emptyImage.png';
import spinnerImage from '../images/spinner.gif';

class Thumbs extends Component {

	state = {};
	DEFAULT_PHOTO_URL = emptyImage;
	SPINNER_IMGET_URL = spinnerImage;

	// photos actually being downloaded from server
	downloadingPhotos = [];

	constructor(props) {
		super(props);
		this.chooseThumb = this.chooseThumb.bind(this);
		this.onPhotoVisibilityChange = this.onPhotoVisibilityChange.bind(this);
		this.onPhotoIsLoaded = this.onPhotoIsLoaded.bind(this);
	}

	shouldComponentUpdate() {
		return false;
	}


	render() {

		console.log("Thumbs-> render()");

		const thumbUrl = `${config.imageProxyUrl}/photo/thumb/${this.props.urlPath}`;
		const files = this.props.album.files;
		const curIndex = this.props.selectedPhotoIndex;

		return (
			<div ref={node => this.node = node} id="divThumbs" className="flexRow" style={{bottom:0, position: "absolute",  maxWidth: "100%", width: "100%", height: "87px", minHeight: "87px", overflowY: "hidden" }}>
				{
					files.map((file, i) => {
						const key = `thumb${i}`;
						const url = `${thumbUrl}/${file}`;
						const className = (i === curIndex) ? "thumb thumbSelected" : "thumb";
						return (
							<InView id={`obsv${i}`} key={key} data-key={key} triggerOnce={false} onChange={this.onPhotoVisibilityChange} >

								<img data-key={key} title={file} id={`imgThumb_${i}`} className={className}
									alt="error"
									data-index={i}
									onClick={this.chooseThumb}
									src={this.DEFAULT_PHOTO_URL}
									data-firstload={false}
									data-isloaded={false}
									style={{ display: 'none' }}
									onLoad={this.onPhotoIsLoaded}
									data-src={url}>
								</img>

								<div id={`thumbLoading${i}`} data-index={i} className={(i === curIndex) ? "thumbLoading thumbSelected" : "thumbLoading"} >
									<img key="xxx" alt="watining..." src={this.SPINNER_IMGET_URL} width="100%" height="100%" />
								</div>

							</InView>
						)
					})
				}
			</div >

		);
	}

	onPhotoIsLoaded(e) {
		if (e && e.target.src !== this.DEFAULT_PHOTO_URL) {
			e.target.style.display = "";
			e.target.dataset.isloaded = true;

			//remove photo from downloading images
			this.downloadingPhotos = this.downloadingPhotos.filter(item => item !== e.target.dataset.key);

			//hide loading spinner
			this.node.querySelector(`#thumbLoading${e.target.dataset.index}`).style.display = "none";
		}
	}

	//FIXME: this method is too complicated, simplified it
	onPhotoVisibilityChange(inView, observer) {

		const image = observer.target.children[0];
		const key = observer.target.dataset.key;

		if (image.dataset.isloaded === "true" && inView === true) {
			this.loadPhotosInAdvance(image.dataset.index);
			return;
		}

		//FIXME: whent thumbs are created, observer event onChange is triggered for all thumbs with attribte inView=true, 
		//then is called second time with attribute false, but just for hidden images
		//makeshift solution is load first 15 thumbs immediately and the rest dynamically
		if (inView === true && image.dataset.firstload === "false" && image.dataset.index > 15) {
			return;
		}
		image.dataset.firstload = true;

		//if photo is not loaded yet, and is hidden again, we cancel request to load photo
		if (inView === false && this.downloadingPhotos.indexOf(key) > -1) {
			image.src = this.DEFAULT_PHOTO_URL;
			this.downloadingPhotos = this.downloadingPhotos.filter(item => item !== key);
			return true;
		}

		//load photo
		if (inView === true) {
			this.downloadingPhotos.push(key);

			//we set src to download photo after some time, because user can scroll with scrollbar up-down, it that case all thumb would be downloading, 
			//so we wait till he stop moving with scrollbar and than load photo
			//but first 15 images we want load immediatelly
			const timeout = image.dataset.index < 15 ? 0 : 500;
			setTimeout(() => {
				if (this.downloadingPhotos.indexOf(key) > -1) {
					image.src = image.dataset.src;
					this.loadPhotosInAdvance(image.dataset.index);
				}
			}, timeout);
		}
	}

	// in onPhotoVisibilityChange can be loaded only visible photos, then when we click on next button, first we see loading spinner, so we load some photos in advance
	loadPhotosInAdvance(currentIndex) {
		currentIndex = parseInt(currentIndex);

		let startIndex = currentIndex - 2;
		startIndex = (currentIndex < 0) ? 0 : startIndex;

		for (let i = startIndex; i < currentIndex + 4; i++) {
			if (startIndex === currentIndex) continue;

			const observer = this.node.querySelector(`#obsv${i}`);

			if (!observer) {
				continue;
			}

			const image = observer.children[0];
			const key = observer.dataset.key;
			if (image.dataset.isloaded === "false" && this.downloadingPhotos.indexOf(key) === -1) {
				image.src = image.dataset.src;
			}
		}
	}

	chooseThumb(e) {
		let element = e.target;
		this.props.setNextFading();
		this.props.onChooseThumb(element.dataset.index, this.node);
		this.props.markThumbAsSelected(element, this.node, false);
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
