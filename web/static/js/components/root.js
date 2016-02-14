import { Socket } from "phoenix";
import React, { Component } from "react";
import ReactDOM from "react-dom";

import { connect, Provider } from "react-redux";

import { userJoin, userMove, userLeave } from "../actions";
import store from "../store";
import Canvas from "./canvas";
import Others from "./others";

const { me } = store.getState();

let socket = new Socket("/socket", { params: { user: me } });
socket.connect();
let channel = socket.channel("rooms:lobby");

channel.join()
	.receive("ok", resp => console.log("Joined successfully", resp))
	.receive("error", resp => console.log("Unable to join", resp));

channel.on("user:move", ({ user, body: coords }) => store.dispatch(userMove(user, coords)));
channel.on("user:join", ({ user }) => store.dispatch(userJoin(user)));
channel.on("user:leave", ({ user }) => store.dispatch(userLeave(user)));

document.addEventListener("mousemove", ({ clientX, clientY }) => {
	channel.push("user:move", { body: { x: clientX / window.innerWidth, y: clientY / window.innerHeight } });
});

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
					position: "relative",
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
