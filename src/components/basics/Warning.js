import React from 'react';

const Warning = (props) => {
	return <div className="mainImage" style={{ textAlign: "center" }}>
		<i style={{ fontSize: "5em" }} className={props.icon}></i><br /><br />
		{props.text}
	</div>
}

export default Warning;