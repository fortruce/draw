import uuid from "uuid";
import Immutable from "immutable";
import * as constants from "./constants";

const initialState = {
	me: uuid.v4(),
	others: Immutable.Map(),
	draws: Immutable.List()
};

// (state, action) => new state subtree to be merged in with state
const actionsMap = {
	[constants.USER_JOIN]: ({ others, me }, { user }) => user !== me && { others: others.set(user, { x: -100, y: -100 }) },
	[constants.USER_LEAVE]: ({ others, me }, { user }) => user !== me && { others: others.delete(user) },
	[constants.USER_MOVE]: ({ others, me }, { user, coords }) => user !== me && { others: others.set(user, coords) },

	[constants.DRAW]: ({ draws }, { start, end, color }) => ({ draws: draws.push({ start, end, color }) })
};

export default function reducer(state = initialState, action) {
	const fn = actionsMap[action.type];
	if (!fn) {
		return state;
	}
	return Object.assign({}, state, fn(state, action));
}
