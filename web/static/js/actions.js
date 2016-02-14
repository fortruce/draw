import * as constants from "./constants";

export function userJoin(user) {
	return { type: constants.USER_JOIN, user };
}

export function userLeave(user) {
	return { type: constants.USER_LEAVE, user };
}

export function userMove(user, coords) {
	return { type: constants.USER_MOVE, user, coords };
}
