import React from "react";
import { createRoot } from "react-dom/client";
import MmdMetaBox from "./components/MmdMetaBox";
import "./admin-post-type.css";

document.addEventListener("DOMContentLoaded", () => {
	const linktMetaBox = document.getElementById("linkt-post-metabox");
	if (linktMetaBox) {
		const root = createRoot(linktMetaBox);
		root.render(<MmdMetaBox linktObj={linktPostObj} />);
	}
});
