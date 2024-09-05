/*
 * Site Chat Admin / Settings Page JS
 */
const { render } = wp.element;
import Settings from "./backend/Settings";
import "./backend/settings.css";

document.addEventListener("DOMContentLoaded", function () {
	const linktObj = linktSetObj;
	const element = document.getElementById("linkt-root");

	if (element) {
		render(<Settings linktObj={linktObj} />, element);
	}
});
