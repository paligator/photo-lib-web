import React, { useRef } from 'react';
import { Button } from 'reactstrap';

const PhotoTags = (props) => {

	const node = useRef();

	function getBtnClasses(tag, props) {
		return `btn-tag ${tag} ${props.tags.indexOf(tag) > -1 ? " active" : ""}`;
	}

	function onClick(e, props) {
		const clickedBtn = e.target;
		const isActive = clickedBtn.classList.contains("active");
		const activeTagBtns = node.current.querySelectorAll('.active');

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
		if (props.updateTags) {
			props.updateTags({ variables: { albumId: props.albumId, photoName: props.photoName, addTags, removeTags } });
		}

		if (props.markThumbWithTag) {
			props.markThumbWithTag(addTags);
		}


	}

	return (
		/* Without key on div, there was a problem, that active button stayed active, even it shouldn't */
		<div key={props.photoName} ref={node} className="leftMenuItem" style={{ verticalAlign: "middle", display: "block" }}>
			<Button data-tag="nice" className={getBtnClasses("nice", props)} onClick={(e) => onClick(e, props)} disabled={props.disabled}>Nice</Button>
			<Button data-tag="top" className={getBtnClasses("top", props)} onClick={(e) => onClick(e, props)} disabled={props.disabled}>TOP</Button>
			<Button data-tag="boring" className={getBtnClasses("boring", props)} onClick={(e) => onClick(e, props)} disabled={props.disabled}>boring</Button>
		</div>
	);

}


export default PhotoTags;


