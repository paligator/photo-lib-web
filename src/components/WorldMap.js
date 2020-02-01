import React, { useEffect, useState } from 'react';
import { VectorMap } from "react-jvectormap";
import * as actions from "../constants/action-types";
import * as c from '../api/Common';
import Context from "../context";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

const WorldMap = () => {

	const [albumIsReset, setAlbumIsReset] = useState(false);

	const dispatch = useDispatch();
	const history = useHistory();

	useEffect(() => {

		if (albumIsReset === false) {
			dispatch({ type: actions.RESET_ALBUM });
			setAlbumIsReset(true);
		}

		// this is call when unmount
		return () => {
			hideMapLabel();
		};

	}, [albumIsReset, dispatch])

	function selectRegion(e, countryCode, albums) {

		const selectedAlbums = albums.filter(album => (album.countries.indexOf(countryCode) > -1));
		if (selectedAlbums.length > 1) {
			console.error(`There are more albums for country "${countryCode}" -> ${selectedAlbums.map(a => a.name)}`);
		} else if (selectedAlbums.length === 1) {
			// open album
			const album = selectedAlbums[0];
			history.push(`/album/${album.continent}/${album.name}`);
		}
	}

	function onOverRegion(e, countryCode, albums) {
		if (albums.some(album => (album.countries.indexOf(countryCode) > -1))) {
			e.target.style.cursor = 'pointer';
		} else {
			e.target.style.cursor = 'auto';
		}
	}

	/* When map is unmounted and label of country is visible, that label stays still visible on next screen, I haven't found better way how to hide it */
	function hideMapLabel() {
		const labels = document.getElementsByClassName("jvectormap-tip");
		if (labels) {
			Array.from(labels).forEach(label => {
				label.style.display = "none";
			});
		}
	}

	return (

		<Context.Consumer>
			{context => {

				const albums = (context.albums.status === "loading") ? [] : context.albums.data;
				const countryColorMap = {};

				albums.forEach(album => {
					const countries = c.meOrVal(album.countries, []);
					countries.forEach(country => {
						countryColorMap[country] = 0;
					})
				})

				return (<div style={{ height: "80%", width: "100%", alignItems: "center", justifyContent: "center", display: "flex" }}>
					<VectorMap
						map={'world_mill'}
						backgroundColor="transparent"
						zoomOnScroll={true}
						color="red"
						containerStyle={{
							marginTop: "5vh",
							width: '100%',
							height: '100%',
							maxWidth: "90vw",
							maxHeight: "90vh"
						}}
						onRegionClick={(e, countryCode) => selectRegion(e, countryCode, albums)}
						onRegionOver={(e, countryCode) => onOverRegion(e, countryCode, albums)}
						containerClassName="map"
						regionStyle={{
							initial: {
								fill: "var(--map-bg-color)",
								"fill-opacity": 1,
								stroke: "none",
								"stroke-width": 0,
								"stroke-opacity": 0
							},
							hover: {
								fill: "#9bcff0",
								"fill-opacity": 1,
								cursor: "pointer"
							},
							selected: {
								fill: "blue" //color for the clicked country
							},
							selectedHover: {}
						}}
						regionsSelectable={false}
						series={{
							regions: [
								{
									values: countryColorMap,
									scale: ["#006699"],
									normalizeFunction: "polynomial"
								}
							]
						}}
					/>
				</div>)
			}}

		</Context.Consumer>
	)

}

export default WorldMap;