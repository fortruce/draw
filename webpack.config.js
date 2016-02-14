var path = require("path");

module.exports = {
	entry: "./web/static/js/app.js",
	output: {
		path: "./priv/static/js",
		filename: "app.js"
	},
	resolve: {
		root: [path.join(__dirname, "./node_modules")]
	},
	module: {
		loaders: [
			{ test: /\.js$/, loader: "babel" },
			{ test: /\.css$/, loader: "style-loader!css-loader" }
		]
	}
};
