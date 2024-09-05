import React, { useState, useEffect } from "react";
import { __ } from "@wordpress/i18n";

const Dashboard = ({ linktObj }) => {
	const dashboardList = linktObj.linktOptions;

	return <div className="linkt-dash-stats">Dashboard Widget</div>;
};

export default Dashboard;
