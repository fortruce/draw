import React, { Component } from "react";

export default class Canvas extends Component {
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
