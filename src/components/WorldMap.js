import React, { Component } from 'react';
import { connect } from "react-redux";
import { VectorMap } from "react-jvectormap";
import { Query } from "react-apollo";
import * as gqlCommands from '../api/GqlCommands';
import * as actions from "../constants/action-types";
import * as c from '../api/Common';

class WorldMap extends Component {

	componentDidMount() {
		this.props.onResetAlbum();
	}

	render() {

		return (
			<Query query={gqlCommands.GET_ALL_ALBUMS_GQL}>
				{({ loading, data }) => {

					const countryColorMap = {};

					const albums = (loading === true) ? [] : c.meOrVal(data.albums, []);
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
							onRegionClick={this.selectRegion}
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
			</Query>
		)
	}
}


function mapStateToProps() {
	return {};
}

function mapDispatchToProps(dispatch) {
	return {
		onResetAlbum: () => {
			dispatch({ type: actions.RESET_ALBUM });
		}
	}
}


export default connect(mapStateToProps, mapDispatchToProps)(WorldMap);