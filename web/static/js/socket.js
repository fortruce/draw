import { Socket } from "phoenix";
import uuid from "uuid";
import React, { Component } from "react";
import ReactDOM from "react-dom";

import { createStore } from "redux";
import { connect, Provider } from "react-redux";
import Immutable from "immutable";
import Color from "color";

// Redux

const USER_JOIN = "USER_JOIN";
const USER_LEAVE = "USER_LEAVE";
const USER_MOVE = "USER_MOVE";

function userJoin(user) {
	return { type: USER_JOIN, user };
}

function userLeave(user) {
	return { type: USER_LEAVE, user };
}

function userMove(user, coords) {
	return { type: USER_MOVE, user, coords };
}

const initialState = {
	me: uuid.v4(),
	others: Immutable.Map()
};

// (state, action) => new state subtree to be merged in with state
const actionsMap = {
	[USER_JOIN]: ({ others, me }, { user }) => user !== me && { others: others.set(user, { x: -100, y: -100 }) },
	[USER_LEAVE]: ({ others, me }, { user }) => user !== me && { others: others.delete(user) },
	[USER_MOVE]: ({ others, me }, { user, coords }) => user !== me && { others: others.set(user, coords) }
}

function reducer(state = initialState, action) {
	const fn = actionsMap[action.type];
	if (!fn) {
		return state;
	}
	return Object.assign({}, state, fn(state, action));
}

const store = createStore(reducer);
// store.subscribe(() => console.log(store.getState().others.toJS()));
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

// React

class Canvas extends Component {
	handleMouseDown = ({ clientX, clientY }) => {
		if (!this._drawing) {
			this._drawing = true;
			this.ctx.beginPath();
			this.ctx.moveTo(clientX, clientY);
		}
	}
	handleMouseUp = ({ clientX, clientY }) => {
		if (this._drawing) {
			this._drawing = false;
			this.ctx.lineTo(clientX, clientY);
			this.ctx.stroke();
			this.ctx.closePath();
		}
	}
	handleMouseMove = ({ clientX, clientY }) => {
		if (this._drawing) {
			this.ctx.lineTo(clientX, clientY);
			this.ctx.stroke();
		}
	}
	componentWillReceiveProps({ width, height }) {
		if (width !== this.props.width
			|| height !== this.props.height) {
			this.canvas.innerWidth = width;
			this.canvas.innerHeight = height;
		}
	}
	shouldComponentUpdate() {
		return false;
	}
	render() {
		const { width, height } = this.props;
		return (
			<canvas
				onMouseDown={ this.handleMouseDown }
				onMouseUp={ this.handleMouseUp }
				onMouseMove={ this.handleMouseMove }
				onMouseLeave={ this.handleMouseUp }
				width={ width }
				height={ height }
				ref={ ref => {
					this.canvas = ref;
					this.ctx = this.canvas ? this.canvas.getContext("2d") : null;
				}}>
			</canvas>
		);
	}
}

function sum(arr) {
	return arr.reduce((a,b) => a+b, 0);
}

function uuidToColor(uuid) {
	let parts = uuid.split("-").map(s => parseInt(s, 16));
	parts = [
		sum(parts.slice(0,1)) % 255,
		sum(parts.slice(1,3)) % 255,
		sum(parts.slice(3)) % 255
	];
	return Color().rgb(parts).rgbString();
}

const Other = ({ coords: { x, y }, user }) => {
	return (
		<div
			style={{
				position: "fixed",
				top: y * window.innerHeight - 5,
				left: x * window.innerWidth - 5,
				width: 10,
				height: 10,
				borderRadius: "50%",
				backgroundColor: uuidToColor(user)
			}}>
		</div>
	);
};

let Others = ({ others }) => {
	return (
		<div>
			{ others.map((coords, user) => <Other key={ user } coords={ coords } user={ user } />).toArray() }
		</div>
	);
}
Others = connect(state => ({ others: state.others }))(Others);

class App extends Component {
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

ReactDOM.render(
	<Provider store={ store }>
		<App />
	</Provider>,
	document.getElementById("container")
);

export default socket;
