import Color from "color";

function sum(arr) {
	return arr.reduce((a,b) => a+b, 0);
}

export function uuidToColor(uuid) {
	let parts = uuid.split("-").map(s => parseInt(s, 16));
	parts = [
		sum(parts.slice(0,1)) % 255,
		sum(parts.slice(1,3)) % 255,
		sum(parts.slice(3)) % 255
	];
	return Color().rgb(parts).rgbString();
}
