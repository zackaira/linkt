const { render } = wp.element;
import LinktMetaBox from "./components/LinktMetaBox";
import LinktSocialBox from "./components/LinktSocialBox";
import "./linkt-post-type.css";

document.addEventListener("DOMContentLoaded", () => {
	const linktMetaBox = document.getElementById("linkt-post-metabox");
	if (linktMetaBox) {
		render(<LinktMetaBox linktObj={linktPostObj} />, linktMetaBox);
	}

	const linktSocialBox = document.getElementById("linkt-social-root");
	if (linktSocialBox) {
		render(<LinktSocialBox linktObj={linktPostObj} />, linktSocialBox);
	}
});
