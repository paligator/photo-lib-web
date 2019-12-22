import React, { useState } from 'react';
import { useDispatch } from "react-redux";
import { Navbar, Collapse, Nav, NavItem, NavbarToggler, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import * as actions from "../constants/action-types";
import { Link } from 'react-router-dom';
import { Query } from "react-apollo";
import * as gqlCommands from '../api/GqlCommands';
import globe from '../images/globe.png';
import config from '../config';
import { isUserLogged } from "../api/Authorization"
const C = require('../api/Common');

const Navigation = () => {

	const [togglerOpened, toggle] = useState(false);
	const dispatch = useDispatch();
	const continents = config.categories;
	const logged = isUserLogged();

	const getAlbumDropDownItems = (continent, contAlbums) => {
		if (logged === true && contAlbums.length > 0)
			return (
				contAlbums.map(album => (
					<DropdownItem key={album.id}>
						<NavItem key={album.id} onClick={() => toggle(false)} >
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

	const AlbumsMenu = () => {
		if (logged === true)
			return (<Query query={gqlCommands.GET_ALL_ALBUMS_GQL}>
				{({ loading, data }) => {
					const albums = (loading === true || !data) ? [] : C.meOrVal(data.albums, []);
					return continents.map(cont => (
						<UncontrolledDropdown nav inNavbar key={cont} title={cont}>
							<DropdownToggle nav caret>
								{cont}
							</DropdownToggle>
							<DropdownMenu>
								{getAlbumDropDownItems(cont, albums.filter(album => album.continent === cont))}
							</DropdownMenu>
						</UncontrolledDropdown>
					))
				}}
			</Query>)
		else {
			return (
				continents.map(cont => (
					<UncontrolledDropdown nav inNavbar key={cont} title={cont}>
						<DropdownToggle nav caret>
							{cont}
						</DropdownToggle>
						<DropdownMenu>
							{getAlbumDropDownItems(cont, [])}
						</DropdownMenu>
					</UncontrolledDropdown>
				))
			)
		}
	}

	return (

		<Navbar color="dark" dark expand="md" >
			{/* TODO do it nice, with NavbarBrand, there was error in logs "<a> cannot appear as a descendant of <a>."" */}
			{/* <NavbarBrand> */}
			<Link className="navItem navbar-brand" to={`/`} >
				<img alt="globe" src={globe} width="65px"></img>
			</Link>
			<NavbarToggler onClick={() => toggle(!togglerOpened)} aria-label="Show/hide menu"></NavbarToggler>
			<Collapse isOpen={togglerOpened} navbar>
				<Nav navbar className="navbar-center" >
					<AlbumsMenu />
				</Nav>
				<Nav navbar>
					<UncontrolledDropdown nav inNavbar key="help" title="help">
						<DropdownToggle className="navbar-dropdown"><i className="fas fa-cog" aria-label="Help" /></DropdownToggle>
						<DropdownMenu className="dropdown-menu-right">
							{(logged === true) ?
								(<DropdownItem key="logout">
									<NavItem key="logout" onClick={() => dispatch({ type: actions.LOGOUT })}>
										<Link className="navItem" to={`/login`}>Logout</Link>
									</NavItem>
								</DropdownItem>) :
								(null)
							}
							<DropdownItem key="aboutMe">
								<NavItem key="aboutMe">
									<Link className="navItem" to={`/aboutme`}>About Me</Link>
								</NavItem>
							</DropdownItem>
						</DropdownMenu>
					</UncontrolledDropdown>
				</Nav>
			</Collapse>
		</Navbar >
	);
}

export default Navigation;