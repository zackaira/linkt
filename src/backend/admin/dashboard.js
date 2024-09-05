const { render } = wp.element;
import DashboardList from "./components/DashboardList";
import "./dashboard.css";

document.addEventListener("DOMContentLoaded", () => {
	const linktDashboardBox = document.getElementById("linkt-dashboard-widget");
	if (linktDashboardBox) {
		render(<DashboardList linktObj={linktDashObj} />, linktDashboardBox);
	}
});
