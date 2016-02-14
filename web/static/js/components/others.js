import React from "react";
import { connect } from "react-redux";
import { uuidToColor } from "../helpers";

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
