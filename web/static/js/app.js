// Import dependencies
import "phoenix_html";
import "reset.css";
import "../css/app.css";

import ReactDOM from "react-dom";
import React from "react";
import { Provider } from "react-redux";

import store from "./store";
import Root from "./components/root";

ReactDOM.render(
	<Provider store={ store }>
		<Root />
	</Provider>,
	document.getElementById("container")
);
