import { connect } from "react-redux";
import { isAnyUserRoleAllowed } from "../../api/Authorization"

const check = (userRoles, action) => {
	return isAnyUserRoleAllowed(userRoles, action);
};

const Can = props =>
	check(props.userRoles, props.perform)
		? props.yes()
		: props.no();

Can.defaultProps = {
	yes: () => null,
	no: () => null
};

const mapStateToProps = (state) => {
	return {
		userRoles: state.userRoles,
	};
}

export default connect(mapStateToProps)(Can);
