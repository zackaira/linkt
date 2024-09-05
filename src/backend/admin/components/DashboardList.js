import DashboardPostList from "./DashboardPostList";
import DashboardCategoriesList from "./DashboardCategoriesList";

const DashboardList = () => {
	const dashboardList = linktDashObj.linktOptions;

	return (
		<div className="linkt-dash-stats">
			{dashboardList.dash_display === "single" ? (
				<DashboardPostList linktObj={linktDashObj} options={dashboardList} />
			) : (
				<DashboardCategoriesList
					linktObj={linktDashObj}
					options={dashboardList}
				/>
			)}
		</div>
	);
};

export default DashboardList;
