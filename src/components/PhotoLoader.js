import React, { Component } from 'react';
import { connect } from "react-redux";
import ReactLoading from 'react-loading';
import { Warning } from '../components';

class PhotoLoader extends Component {

	state = { photoLoadingState: "initNewPhoto" };
	_isMounted = false;

	timeoutToShowLoading = 400;

	constructor() {
		super();
		this.onPhotoIsLoaded = this.onPhotoIsLoaded.bind(this);
		this.timeout = this.timeout.bind(this);
		this.onPhotoLoadError = this.onPhotoLoadError.bind(this);
		this.timeout();
	}

	shouldComponentUpdate(nextProps) {

		if (this.props.imageUrl !== nextProps.imageUrl) {
			this.setState({ photoLoadingState: "initNewPhoto" });
			this.timeout();
			return false;
		}
		return true;
	}

	componentDidMount() {
		this._isMounted = true;
	}

	render() {

		const classNames = "animated photoLoader " + this.props.className;

		return (
			<div className={classNames} style={{ display: this.props.display }} id={this.props.id} ref={node => this.node = node} onAnimationEnd={this.props.onAnimationEnd} >

				{(this.state.photoLoadingState === "waiting" && this.props.photoUrl !== '') ?
					(
						<div className="mainImage" style={{ position: "absolute", width: "25%" }}>
							<ReactLoading type='spin' style={{ width: "100%", height: "100%" }} />
						</div>
					) : null
				}

				{(this.state.photoLoadingState === "error" && this.props.photoUrl !== '') ?
					(
						<Warning text={`Sorry, there was a problem to get photo "${this.props.photoName}"!`} icon="fas fa-bug" />
					) : null
				}

				{
					(this.props.photoUrl) ? (
						<img id={this.props.imgId} alt={`There is something wrong with ${this.props.photoName}`} data-next="next"
							className="mainImage myShadow"
							title={this.props.photoName}
							style={{ display: this.state.photoLoadingState === "finished" ? "" : "none" }}
							src={this.props.photoUrl} onLoad={this.onPhotoIsLoaded} onError={this.onPhotoLoadError} />
					) : null
				}
			</div >
		);
	}

	//When new picture should be shown I set photoLoadingState "initNewPhoto", if picture is not loaded within timeoutToShowLoading miliseconds, then I show loading image
	//If is set photoLoadingState "waiting" immediatelly, there would be after each new photo loadingImage, it would be disturbing for fast loaded photo
	timeout() {
		this.timer = setTimeout(() => {
			if (this.state.photoLoadingState === "initNewPhoto") {
				if (this._isMounted === true)
					this.setState({ photoLoadingState: "waiting" });
			}
		}, this.timeoutToShowLoading);
	}

	onPhotoIsLoaded() {
		this.setState({ photoLoadingState: "finished" });
	}

	onPhotoLoadError() {
		this.setState({ photoLoadingState: "error" })
	}

}


// eslint-disable-next-line no-unused-vars
function mapStateToProps(state) {
	return {
	};
}

// eslint-disable-next-line no-unused-vars
function mapDispatchToProps(dispatch) {
	return {
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(PhotoLoader);
