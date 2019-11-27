import React, { Component } from 'react';
import { Button } from 'reactstrap';

class PhotoTags extends Component {

	constructor(props) {
		super(props);
		this.onClick = this.onClick.bind(this);
		this.getBtnClasses = this.getBtnClasses.bind(this);
	}

	render() {

		console.log(`PhotoTags: ${JSON.stringify(this.props.tags)}`);

		return (
			/* Without key on div, there was a problem, that active button stayed active, even it shouldn't */
			<div key={this.props.photoName} className="leftMenuItem" ref={node => this.node = node} style={{ verticalAlign: "middle", display: "block" }}>
				<Button data-tag="nice" className={this.getBtnClasses("nice")} onClick={this.onClick} disabled={this.props.disabled}>Nice</Button>
				<Button data-tag="top" className={this.getBtnClasses("top")} onClick={this.onClick} disabled={this.props.disabled}>TOP</Button>
				<Button data-tag="boring" className={this.getBtnClasses("boring")} onClick={this.onClick} disabled={this.props.disabled}>boring</Button>
			</div>
		);
	}

	getBtnClasses(tag) {
		return `btn-tag ${tag} ${this.props.tags.indexOf(tag) > -1 ? " active" : ""}`;
	}

	onClick(e) {
		const clickedBtn = e.target;
		const isActive = clickedBtn.classList.contains("active");
		const activeTagBtns = this.node.querySelectorAll('.active');

		const removeTags = [];
		const addTags = [];

		activeTagBtns.forEach(btn => {
			removeTags.push(btn.dataset.tag);
			btn.classList.remove("active");
		});

		// mark clicked tag as active
		if (isActive === false) {
			clickedBtn.classList.add("active");
			addTags.push(clickedBtn.dataset.tag);
		}

		// call props method update tags with added, deleted tags
		if (this.props.updateTags) {
			this.props.updateTags({ variables: { albumId: this.props.albumId, photoName: this.props.photoName, addTags, removeTags } });
		}
	}
}

PhotoTags.defaultProps = {
	tags: [],
	disabled: false,
};

export default PhotoTags;


