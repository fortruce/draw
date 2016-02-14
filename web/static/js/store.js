import { createStore, applyMiddleware } from "redux";
import reducer from "./reducer";
import * as constants from "./constants";
import { channel } from "./socket";

const drawer = store => next => action => {
	if (action.type === constants.DRAW && action.me) {
		const { type, start, end, color } = action;
		channel.push("draw", { body: { start, end, color } });
	}
	return next(action);
}

const store = createStore(
	reducer,
	applyMiddleware(drawer)
);

export default store;
