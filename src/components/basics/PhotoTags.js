import React, { Component } from 'react';
import { Button } from 'reactstrap';
import * as C from "../../api/Common";

class PhotoTags extends Component {

	constructor(props) {
		super(props);
		this.onClick = this.onClick.bind(this);
		this.getBtnClasses = this.getBtnClasses.bind(this);
		this.getSelectedTags = this.getSelectedTags.bind(this);
	}

	render() {

		return (
			<div className="leftMenuItem" ref={node => this.node = node} style={{ verticalAlign: "middle", display: "block" }}>
				<Button data-tag="nice" className={this.getBtnClasses("nice")} onClick={this.onClick} disabled={this.props.disabled}>Nice</Button>
				<Button data-tag="top" className={this.getBtnClasses("top")} onClick={this.onClick} disabled={this.props.disabled}>TOP</Button>
				<Button data-tag="boring" className={this.getBtnClasses("boring")} onClick={this.onClick} disabled={this.props.disabled}>boring</Button>

				{(this.props.showNotTaggedTag === true) ?
					(<Button data-tag="notTagged" className={this.getBtnClasses("notTagged")} onClick={this.onClick}>No Tag</Button>) : (null)
				}

			</div>
		);
	}

	getBtnClasses(tag) {
		return `btn-tag ${tag} ${this.props.tags.indexOf(tag) > -1 ? " active" : ""}`
	}

	onClick(e) {
		const clickedBtn = e.target;
		const isActive = clickedBtn.classList.contains("active");
		const activeTagBtns = this.node.querySelectorAll('.active');

		const removeTags = [];
		const addTags = [];

		// in single mode we deselect all active tags
		if (this.props.mode === 'single') {
			activeTagBtns.forEach(btn => {
				removeTags.push(btn.dataset.tag);
				btn.classList.remove("active");
			});
		} else {
			// in multi mode only clicked btn
			clickedBtn.classList.remove("active");
		}

		// mark clicked tag as active
		if (isActive === false) {
			clickedBtn.classList.add("active");
			addTags.push(clickedBtn.dataset.tag);
		}

		// call props method update tags with added, deleted tags
		if (this.props.updateTags) {
			this.props.updateTags({ variables: { albumId: this.props.albumId, photoName: this.props.photoName, addTags, removeTags } });
		}

		//save active tags into cookies
		if (this.props.saveSelected === true) {
			const tags = this.getSelectedTags();
			C.setCookie(this.props, 'selectedFilterTags', JSON.stringify(tags));
			//this.props.updatePhotoFilterTags(tags);
		}
	}

	getSelectedTags() {
		const activeTagBtns = this.node.querySelectorAll('.active');
		const tags = [];
		activeTagBtns.forEach(btn => {
			tags.push(btn.dataset.tag);
		});
		return tags;
	}
}

PhotoTags.defaultProps = {
	mode: "single",
	tags: [],
	showNotTagged: false,
	saveSelected: false,
	disabled: false,
};

export default PhotoTags;


