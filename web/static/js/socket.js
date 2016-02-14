import { Socket } from "phoenix";

import { userJoin, userMove, userLeave } from "./actions";
import store from "./store";

const { me } = store.getState();
const socket = new Socket("/socket", { params: { user: me } });

socket.connect();
const channel = socket.channel("rooms:lobby");

channel.join()
	.receive("ok", resp => console.log("Joined successfully", resp))
	.receive("error", resp => console.log("Unable to join", resp));

channel.on("user:move", ({ user, body: coords }) => store.dispatch(userMove(user, coords)));
channel.on("user:join", ({ user }) => store.dispatch(userJoin(user)));
channel.on("user:leave", ({ user }) => store.dispatch(userLeave(user)));

document.addEventListener("mousemove", ({ clientX, clientY }) => {
	channel.push("user:move", { body: { x: clientX / window.innerWidth, y: clientY / window.innerHeight } });
});
