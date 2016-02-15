import React from "react";
import { connect } from "react-redux";
import { uuidToColor } from "../helpers";

function constrainCoordsToView({ x, y }) {
	const { innerWidth, innerHeight } = window;
	return {
		x: Math.min(innerWidth, x),
		y: Math.min(innerHeight, y)
	};
}

const Other = ({ coords, user }) => {
	const { x, y } = constrainCoordsToView(coords);
	return (
			<div
				style={{
					position: "fixed",
					top: y - 5,
					left: x - 5,
					width: 10,
					height: 10,
					borderRadius: "50%",
					backgroundColor: uuidToColor(user)
				}}>
			</div>
	);
};

const Others = ({ others }) => {
	return (
		<div>
			{
				others.map((coords, user) => (
					<Other
						key={ user }
						coords={ coords }
						user={ user } />
				)).toArray()
			}
		</div>
	);
}

export default connect(state => ({ others: state.others }))(Others);
