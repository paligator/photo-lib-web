import React, { Component } from 'react';

class ErrorBoundary extends Component {
	constructor(props) {
		super(props);

		this.state = { error: null, errorInfo: null, hasError: false };
	}


	componentDidCatch(error, errorInfo) {
		console.log("ErrorBoundary -> componentDidCatch");

		this.setState({
			hasError: true,
			error: error,
			errorInfo: errorInfo
		});
	}

	// static getDerivedStateFromError(error, errorInfo) {
	// 	console.log("ErrorBounday -> getDerivedStateFromError hura sme tu")
	// 	return {
	// 		hasError: true,
	// 		error: error,
	// 		errorInfo: errorInfo
	// 	};
	// }

	render() {
		if (this.state.hasError === true) {
			return (
				<div>
					<h2>Something went wrong.</h2>
					<details style={{ whiteSpace: "pre-wrap" }}>
						{this.state.error && this.state.error.toString()}
						<br />
						{(this.state.errorInfo) ? this.state.errorInfo.componentStack : ""}
					</details>
				</div>
			);
		} else {
			return this.props.children;
		}

	}
}

export default ErrorBoundary;