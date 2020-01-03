import React from 'react';
import { useSelector } from "react-redux";

const AlbumInfo = () => {

	const album = useSelector(state => state.selectedAlbum);
	const date = `${album.month ? album.month + "/" : ""}${album.year || ""}`;

	return (
		<div className="leftMenuItem boxUderline">
			<h1 style={{ overflowWrap: "break-word" }}>{album.name}</h1>
			<p>{date}</p>
		</div>
	);

}

export default AlbumInfo
