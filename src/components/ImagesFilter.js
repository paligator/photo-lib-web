import React, { Component } from 'react';
import { connect } from "react-redux";
import * as actions from "../constants/action-types";
import { Switcher } from '../components';
import * as C from '../api/Common';

class ImagesFilter extends Component {

	constructor() {
		super();

		this.onChangeShowOnlyFavourites = this.onChangeShowOnlyFavourites.bind(this);
		this.onChangeShowOriginals = this.onChangeShowOriginals.bind(this);
	}

	render() {
		return (
			<div className="leftMenuItem boxUderline">
				<h4>Photos:</h4>
				<p><Switcher checked={this.props.showOnlyFavourites} onChange={this.onChangeShowOnlyFavourites} /><span>Only favourites</span></p>
			</div>
		)
	}

	onChangeShowOnlyFavourites(e) {
		const onlyFavourites = e.target.checked;
		C.setCookie(this.props, 'showOnlyFavourites', onlyFavourites)

		this.props.onChangeShowOnlyFavourites(onlyFavourites);
	}

	onChangeShowOriginals(e) {
		const showOriginals = e.target.checked;
		C.setCookie(this.props, 'showOriginals', showOriginals)

		this.props.onChangeShowOriginals(showOriginals);
	}

}

function mapStateToProps(state, ownProps) {
	return {
		showOriginals: state.showOriginals,
		showOnlyFavourites: state.showOnlyFavourites,
		cookies: ownProps.cookies
	};
}

function mapDispatchToProps(dispatch) {
	return {
		onChangeShowOriginals: (showOriginals) => {
			dispatch({ type: actions.CHANGE_SHOW_ORIGINALS, payload: { status: showOriginals } });
		},
		onChangeShowOnlyFavourites: (onlyFavourites) => {
			dispatch({ type: actions.CHANGE_SHOW_ONLY_FAVOURITES, payload: { onlyFavourites } });
		},
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ImagesFilter);
