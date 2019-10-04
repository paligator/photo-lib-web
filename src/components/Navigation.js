import React, { Component } from 'react';
import { connect } from "react-redux";
import { Navbar, Collapse, Nav, NavItem, NavbarToggler, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import * as actions from "../constants/action-types";
import { Link } from 'react-router-dom';
import { Query } from "react-apollo";
import * as gqlCommands from '../api/GqlCommands';
import globe from '../images/globe.png';
import config from '../config';
const C = require('../api/Common');

class Navigation extends Component {

	constructor(props) {
		super(props);

		this.toggle = this.toggle.bind(this);
		this.logOut = this.logOut.bind(this);

		this.state = {
			togglerOpened: false
		};

	}

	toggle() {
		this.setState({
			togglerOpened: !this.state.togglerOpened
		});
	}

	logOut() {
		this.props.onLogout();
	}

	render() {

		let continents = config.categories;
		return (

			<Navbar color="dark" dark expand="md" >
				{/* TODO do it nice, with NavbarBrand, there was error in logs "<a> cannot appear as a descendant of <a>."" */}
				{/* <NavbarBrand> */}
				<Link className="navItem navbar-brand" to={`/`} >
					<img alt="globe" src={globe} width="65px"></img>
				</Link>
				{/* </NavbarBrand> */}
				<NavbarToggler onClick={this.toggle} />
				<Collapse isOpen={this.state.togglerOpened} navbar>
					<Nav navbar className="navbar-nav navbar-center" >
						<Query query={gqlCommands.GET_ALL_ALBUMS_GQL}>
							{({ loading, data }) => {

								const albums = (loading === true || !data) ? [] : C.meOrVal(data.albums, []);
								return continents.map(cont => (
									<UncontrolledDropdown nav inNavbar key={cont} title={cont}>
										<DropdownToggle nav caret>
											{cont}
										</DropdownToggle>
										<DropdownMenu>
											{this.getAlbumDropDownItems(cont, albums.filter(album => album.continent === cont))}
										</DropdownMenu>
									</UncontrolledDropdown>
								))
							}}
						</Query>
					</Nav>

					<Nav navbar className="navbar-nav" >
						<UncontrolledDropdown nav inNavbar key="help" title="help">
							<DropdownToggle nav>⚙</DropdownToggle>
							<DropdownMenu className="dropdown-menu-right">
								<DropdownItem key="logout">
									<NavItem key="logout" onClick={this.logOut}>
										<Link className="navItem" to={`/login`} >Logout</Link>
									</NavItem>
								</DropdownItem>
							</DropdownMenu>
						</UncontrolledDropdown>
					</Nav>

				</Collapse>


			</Navbar >
		);

	}

	getAlbumDropDownItems(continent, contAlbums) {
		if (contAlbums.length > 0)
			return (
				contAlbums.map(album => (
					<DropdownItem key={album.id}>
						<NavItem key={album.id} onClick={this.toggle} >
							<Link className="navItem" to={`/album/${album.continent}/${album.name}`}>{C.formatAlbumName(album)}</Link>
						</NavItem>
					</DropdownItem>
				))
			);
		else
			return (
				<DropdownItem key="empty1">
					<NavItem key="empty1" style={{ cursor: "default" }}>{continent.toUpperCase()} soon...</NavItem>
				</DropdownItem>
			)
	}

}

function mapStateToProps(state) {
	return {
		albums: state.albums.value,
	};
}

const mapDispatchToProps = dispatch => {
	return {
		onLogout: () => {
			dispatch({ type: actions.LOGOUT });
		}
	};
};


export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
