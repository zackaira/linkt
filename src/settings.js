/*
 * Site Chat Admin / Settings Page JS
 */
const { render } = wp.element;
import Settings from "./backend/Settings";
import "./backend/settings.css";

document.addEventListener("DOMContentLoaded", function () {
	const mmdObj = mmdSetObj;
	const element = document.getElementById("mmd-root");

	if (element) {
<<<<<<< HEAD
		render(<Settings linktObj={linktObj} />, element);
=======
		const root = createRoot(element);
		root.render(<Settings mmdObj={mmdObj} />);
>>>>>>> 014acdfbeef5dd5d7bc3cd2cdacd60dbb775075c
	}
});
