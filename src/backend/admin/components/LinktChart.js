const { useState, useEffect } = wp.element;
const { __ } = wp.i18n;
import {
	chartDefaults,
	chartDataDefaults,
	getAllPostLinkts,
	getCategories,
	getTotalSeriesData,
	getSeriesData,
	getAllSeriesData,
	sortOnlyWithTagElements,
} from "../../helpers";
import Chart from "react-apexcharts";

const LinktChart = ({
	apiUrl,
	chartData,
	postId,
	tagsArray,
	height,
	hidePeriod,
	chartDisplay,
	isPremium,
	legacy,
}) => {
	if (!apiUrl || !chartData || !postId || !tagsArray) return null;

	// Add "default" tag to the tagsArray if not already included
	const updatedTagsArray = [...tagsArray, { name: "default" }];
	updatedTagsArray.sort((a, b) => {
		if (a.name === "default") return -1;
		if (b.name === "default") return 1;
		return 0;
	});

	const [chartLinkts, setChartLinkts] = useState(
		sortOnlyWithTagElements(chartData, tagsArray)
	);
	const [selectedPeriod, setSelectedPeriod] = useState(chartDisplay);
	const [selectedTag, setSelectedTag] = useState("total");
	const [totalCount, setTotalCount] = useState(chartLinkts.length);
	const [mergedSettings, setMergedSettings] = useState({
		series: chartDataDefaults.series,
		options: {
			...chartDefaults.options,
		},
	});

	/**
	 * Tag Change
	 */
	const handleTagChange = async (e) => {
		const tag = e.target.value === undefined ? "total" : e.target.value;
		setSelectedTag(tag);

		const getNewLinkts = await getAllPostLinkts(
			apiUrl,
			postId,
			selectedPeriod,
			tag
		);
		setChartLinkts(sortOnlyWithTagElements(getNewLinkts, tagsArray));
		setTotalCount(chartLinkts.length);
	};

	/**
	 * Period Change
	 */
	const handlePeriodChange = async (e) => {
		const period = e.target.value === undefined ? "7_days" : e.target.value;
		setSelectedPeriod(period);

		const getNewLinkts = await getAllPostLinkts(
			apiUrl,
			postId,
			period,
			selectedTag
		);
		setChartLinkts(sortOnlyWithTagElements(getNewLinkts, tagsArray));
		setTotalCount(chartLinkts.length);
	};

	/**
	 * Restructure Data for ApexCharts
	 */
	useEffect(() => {
		const categories = getCategories(selectedPeriod);
		let chartData;

		if (selectedTag === "total") {
			const totalSeriesData = getTotalSeriesData(chartLinkts, selectedPeriod);
			chartData = {
				series: [
					{
						name: "Total",
						data: totalSeriesData,
					},
				],
				options: {
					xaxis: {
						categories: categories,
					},
				},
			};
		} else if (selectedTag === "all") {
			const allSeriesData = getAllSeriesData(
				chartLinkts,
				updatedTagsArray,
				selectedPeriod
			);
			chartData = {
				series: allSeriesData,
				options: {
					xaxis: {
						categories: categories,
					},
				},
			};
		} else {
			const seriesData = getSeriesData(
				chartLinkts,
				selectedTag,
				selectedPeriod
			);
			chartData = {
				series: [
					{
						name: selectedTag,
						data: seriesData,
					},
				],
				options: {
					xaxis: {
						categories: categories,
					},
				},
			};
		}

		setMergedSettings(chartData);
	}, [chartLinkts, selectedPeriod, selectedTag]);

	return (
		<>
			{legacy?.old_count > 0 && (
				<div className="linkt-legacy-count">
					{__("This Linkts previous click count was ", "linkt")}
					<span>{legacy.old_count}</span>
				</div>
			)}
			<div className="linkt-post-meta">
				<div className="linkt-post-selects">
					<select
						id="linkt-stats-select"
						className="linkt-select"
						onChange={handleTagChange}
						value={selectedTag}
					>
						<option value="total">{__("Total", "linkt")}</option>
						<option value="all">{__("Show All Tags", "linkt")}</option>
					</select>
					{!hidePeriod && (
						<select
							id="linkt-select"
							className="linkt-select"
							onChange={handlePeriodChange}
							value={selectedPeriod}
						>
							<option value="7_days">{__("last 7 days", "linkt")}</option>
							<option value="14_days">{__("2 weeks", "linkt")}</option>
							<option value="30_days">{__("last 30 days", "linkt")}</option>
							<option
								value="3_months"
								{...(!isPremium ? { disabled: true } : {})}
							>
								{__("last 3 months", "linkt")}
							</option>
							<option
								value="6_months"
								{...(!isPremium ? { disabled: true } : {})}
							>
								{__("last 6 months", "linkt")}
							</option>
							<option
								value="12_months"
								{...(!isPremium ? { disabled: true } : {})}
							>
								{__("last 12 months", "linkt")}
							</option>
						</select>
					)}
				</div>
				<div className="linkt-post-clicks">
					<h5 className="linkt-title">
						{__("Total clicks:", "linkt")} {totalCount}
					</h5>
				</div>
			</div>
			<div className="linkt-apexchart">
				<Chart
					options={mergedSettings.options}
					series={mergedSettings.series}
					type="line"
					width={"100%"}
					height={height || "auto"}
				/>
			</div>
		</>
	);
};

export default LinktChart;
