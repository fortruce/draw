import React, { Component } from "react";

import Canvas from "./canvas";
import Others from "./others";

export default class Root extends Component {
	constructor(props) {
		super(props);
		this.state = { width: window.innerWidth, height: window.innerHeight };
		this.handleResize = this.handleResize.bind(this);
	}
	componentWillMount() {
		window.addEventListener("resize", this.handleResize);
	}
	componentWillUnmount() {
		window.removeEventListener("resize", this.handleResize);
	}
	handleResize({ target: { innerWidth, innerHeight }}) {
		this.setState({ width: innerWidth, height: innerHeight });
	}
	render() {
		const { width, height } = this.state;
		return (
			<div
				style={{
					position: "absolute",
					top: 0, bottom: 0, left: 0, right: 0
				}}>
				<Canvas
					width={ width }
					height={ height } />
				<Others />
			</div>
		);
	}
}
