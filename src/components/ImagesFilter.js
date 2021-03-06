import React, { Component } from 'react';
import { connect } from "react-redux";
import * as actions from "../constants/action-types";
import * as C from '../api/Common';
import { Button, Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import { Tags } from "../constants";

class ImagesFilter extends Component {

	state = {
		tagsFilterIsOpen: false
	}

	constructor(props) {
		super(props);

		this.child = React.createRef();
		this.toggleTagFilter = this.toggleTagFilter.bind(this);
		this.tagButtonClick = this.tagButtonClick.bind(this);
		this.formatTags = this.formatTags.bind(this);
	}

	render() {

		const tags = C.getPhotoFilterTagsFromCookies(this.props.cookies);
		const tagsDesc = this.formatTags(tags);

		const TagButton = (props) => {
			const tag = props.tag;
			return <Button data-tag={tag.name} className={this.getTagBtnClasses(tag.name, tags)} onClick={this.tagButtonClick} style={{ width: "100%", marginTop: 0 }}>{tag.label}</Button>
		}

		return (
			<div className="leftMenuItem boxUderline" ref={node => this.node = node} >
				<h4>Photo Filter:</h4>
				<Dropdown id="tagsFilter" isOpen={this.state.tagsFilterIsOpen} toggle={this.toggleTagFilter}>
					<DropdownToggle id="tagsFilterToggle" caret className="tags-filter-btn" style={{ maxWidth: "100%", whiteSpace: "normal", wordWrap: "break-word" }}>{tagsDesc}</DropdownToggle>

					<DropdownMenu id="tags-filter-menu" className="tags-filter-menu">
						<div style={{ backgroundColor: "white", widht: "100%", height: "100%" }}>
							<TagButton tag={Tags.nice} />
							<TagButton tag={Tags.top} />
							<TagButton tag={Tags.boring} />
							<TagButton tag={Tags.notTagged} />
						</div>
					</DropdownMenu>
				</Dropdown>
			</div >
		)
	}

	toggleTagFilter() {

		const isOpened = this.state.tagsFilterIsOpen;
		const tags = this.getSelectedTags();

		this.setState({
			tagsFilterIsOpen: !isOpened
		});

		if (isOpened === true) {
			C.setCookie(this.props, 'selectedFilterTags', JSON.stringify(tags));
			const album = this.props.selectedAlbum.name;
			this.props.onChangeFilterTags(album, tags);
		}
	}

	getSelectedTags() {
		const activeTagBtns = this.node.querySelectorAll('#tagsFilter .active');
		const tags = [];
		activeTagBtns.forEach(btn => {
			tags.push(btn.dataset.tag);
		});
		return tags;
	}

	formatTags(tags) {
		if (tags && tags.length > 0) {
			return tags.map(tag => Tags[tag].label).join(", ");
		} else {
			return "choose tags";
		}
	}

	tagButtonClick(e) {
		const clickedBtn = e.target;
		const isActive = clickedBtn.classList.contains("active");

		if (isActive === true) {
			clickedBtn.classList.remove("active");
		} else {
			clickedBtn.classList.add("active");
		}

		const tags = this.getSelectedTags();
		this.node.querySelector("#tagsFilterToggle").innerText = this.formatTags(tags);

		//TODO: find better way
		//when select tags text is too long, where is wrap, but menu is not moved and vice-verse and i haven't found better way how move on
		//menu on proper position
		const menu = this.node.querySelector("#tags-filter-menu");
		const style = menu.style;
		menu.style = "";
		menu.style = style;
	}

	getTagBtnClasses(tag, selectedTags) {
		return `btn-tag ${tag} ${selectedTags.indexOf(tag) > -1 ? " active" : ""}`
	}

}

function mapStateToProps(state, ownProps) {
	return {
		cookies: ownProps.cookies,
		selectedAlbum: state.selectedAlbum
	};
}

function mapDispatchToProps(dispatch) {
	return {
		onChangeFilterTags: (albumName, tags) => {
			dispatch({ type: actions.FILTER_ALBUM_PHOTOS, payload: { albumName, tags } });
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ImagesFilter);
