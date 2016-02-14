import React, { Component } from "react";
import { connect } from "react-redux";

import { draw } from "../actions";
import { uuidToColor } from "../helpers";

class Canvas extends Component {
	constructor(props) {
		super(props);
		this.state = { color: uuidToColor(props.me) };
	}

	handleMouseDown = ({ clientX, clientY }) => {
		if (!this._drawing) {
			this._drawing = true;
			this.start = { x: clientX, y: clientY };
		}
	}
	handleMouseUp = ({ clientX, clientY }) => {
		if (this._drawing) {
			this._drawing = false;
			this.end = { x: clientX, y: clientY };
			this.props.dispatch(draw(this.start, this.end, this.state.color));
		}
	}
	handleMouseMove = ({ clientX, clientY }) => {
		if (this._drawing) {
			this.end = { x: clientX, y: clientY };
			this.props.dispatch(draw(this.start, this.end, this.state.color, true));
			this.start = this.end;
		}
	}

	draw(draws) {
		for (let { start, end, color } of draws) {
			this.ctx.beginPath();
			this.ctx.strokeStyle = color;
			this.ctx.moveTo(start.x, start.y);
			this.ctx.lineTo(end.x, end.y);
			this.ctx.stroke();
		}
	}
	componentWillReceiveProps({ width, height, draws }) {
		if (width !== this.props.width
			|| height !== this.props.height) {
			this.canvas.width = width;
			this.canvas.height = height;
			// must redraw canvas after resize
			this.draw(this.props.draws);
		}

		if (draws !== this.props.draws) {
			this.draw(draws.slice(this.props.draws.count()));
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
					if (this.ctx) {
						this.ctx.strokeStyle = this.state.color;
					}
				}}>
			</canvas>
		);
	}
}

export default connect(state => ({ me: state.me, draws: state.draws }))(Canvas);
