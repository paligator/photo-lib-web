import React, { Component } from 'react';

class FavouriteBtn extends Component {

	constructor() {
		super();
	}

	render() {

		const favBtnClass = this.props.isFavourite ? "fav-button-selected fa-heart" : "fav-button fa-heart";

		return (
			<span ref={node => this.node = node} id="btnFav" className={favBtnClass} onClick={this.props.onClick}></span>
		);
	}

}

export default FavouriteBtn;
