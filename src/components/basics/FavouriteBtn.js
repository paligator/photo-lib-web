import React, { Component } from 'react';

class FavouriteBtn extends Component {

	render() {

		const favBtnClass = this.props.isFavourite ? "btn-img btn-img-fav btn-img-act" : "btn-img btn-img-fav btn-img-inact";

		return (
			<button className={favBtnClass} onClick={this.props.onClick} disabled={this.props.disabled}></button>
		);
	}
}

export default FavouriteBtn;
