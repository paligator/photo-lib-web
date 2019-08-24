import React, { Component } from 'react';

class Switcher extends Component {

	render() {

		return (
			<label className="switch">
				<input type="checkbox" checked={this.props.checked} onChange={this.props.onChange} className="primary" />
				<span className="slider round"></span>
			</label>
		);
	}
}

export default Switcher;
