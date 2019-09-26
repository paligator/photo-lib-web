import React, { Component } from 'react';
import { connect } from "react-redux";
import ReactLoading from 'react-loading';

class PhotoLoader extends Component {

	state = { photoLoadingState: "initNewPhoto", parentNotified: false };
	_isMounted = false;

	timeoutToShowLoading = 400;

	constructor() {
		super();
		this.onPictureIsLoaded = this.onPictureIsLoaded.bind(this);
		this.timeout = this.timeout.bind(this);
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

		return (

			<div className="mainImageDiv flexContainer flexRow" id={this.props.id} ref={node => this.node = node}>

				{(this.state.photoLoadingState === "waiting") ?
					(
						<div style={{ position: "absolute", left: "37.5%", top: "15%", height: "auto", width: "25%" }}>
							<ReactLoading type='spin' color="red" style={{ width: "100%", height: "100%" }} />
						</div>
					) : null
				}
				<img id="img1" alt="error" data-next="next"
					className="mainImage"
					style={{ display: this.state.photoLoadingState !== "waiting" ? "inline" : "none" }}
					src={this.props.imageUrl} onLoad={this.onPictureIsLoaded} />

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

	onPictureIsLoaded() {
		this.setState({ photoLoadingState: "finished" });
		this.props.disableNavButtons(false);
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
