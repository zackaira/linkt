<<<<<<< HEAD
const { render } = wp.element;
import DashboardList from "./components/DashboardList";
import "./dashboard.css";

document.addEventListener("DOMContentLoaded", () => {
	const linktDashboardBox = document.getElementById("linkt-dashboard-widget");
	if (linktDashboardBox) {
		render(<DashboardList linktObj={linktDashObj} />, linktDashboardBox);
=======
import React from "react";
import { createRoot } from "react-dom/client";
import Dashboard from "./components/Dashboard";
import "./dashboard.css";

document.addEventListener("DOMContentLoaded", () => {
	const mmdDashboardBox = document.getElementById("mmd-dashboard-widget");
	if (mmdDashboardBox) {
		const root = createRoot(mmdDashboardBox);
		root.render(<Dashboard mmdObj={mmdDashObj} />);
>>>>>>> 014acdfbeef5dd5d7bc3cd2cdacd60dbb775075c
	}
});
