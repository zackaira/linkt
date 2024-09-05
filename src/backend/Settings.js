// Localized JS object - linktObj
const { useState, useEffect } = wp.element;
const { __ } = wp.i18n;
import axios from "axios";
import SettingRow from "./components/SettingRow";
// import SettingGroup from "./components/SettingGroup";
import SettingBlock from "./components/SettingBlock";
import SettingHeader from "./components/SettingHeader";
import GiveFeedback from "./components/GiveFeedback";
import InfoTab from "./InfoTab";
import Loader from "./Loader";
import { linktGroupSettings, blockListSettings } from "./helpers";

const Settings = ({ linktObj }) => {
	const url = `${linktObj.apiUrl}linkt-api/v1`;
	const [loader, setLoader] = useState(false);
	const [loadSetting, setLoadSetting] = useState(true);
	const [activeTab, setActiveTab] = useState("1");
	const isPremium = Boolean(linktObj.isPremium);
	// const wcActive = Boolean(linktObj.wcActive);
	const linktDefaults = linktObj.linktDefaults;

	// console.log(linktDefaults);

	const [linktOptions, setLinktOptions] = useState({});
	const [linktUrlVal, setLinktUrlVal] = useState(false);

	const changeTab = (tabId) => {
		setActiveTab(tabId);
	};

	// setState dynamically for each setting
	const handleChange = ({
		target: { type, checked, name, value, className },
	}) => {
		if (
			type === "checkbox" &&
			(className === "checkbox-single" ||
				className === "toggle-switch-checkbox")
		)
			value = checked;

		const settingGroup = name.substring(0, name.indexOf("_")); // Splits by the first _ and saves that as the group name
		const settingName = name.substring(name.indexOf("_") + 1); // Setting name within group, anything after the first _

		const groupKey = settingGroup === "global" ? name.substring(7) : name;

		setLinktOptions({
			...linktOptions,
			...(!settingGroup || settingGroup === "global" // sn_ name gets saved as default / in no group
				? { [groupKey]: value }
				: {
						[settingGroup]: {
							...linktOptions[settingGroup],
							[settingName]: value,
						},
				  }),
		});
	};

	useEffect(() => {
		linktGroupSettings();
	}, [linktOptions]);

	// Submit form
	const handleSubmit = (e) => {
		e.preventDefault();
		setLoader(true);

		axios
			.post(
				url + "/settings",
				{
					linktOptions: JSON.stringify(linktOptions),
				},
				{
					// Add Nonce to prevent this working elsewhere
					headers: {
						"content-type": "application/json",
						"X-WP-NONCE": linktObj.nonce,
					},
				}
			)
			.then((res) => {
				// console.log(res.data);
				// const linktOptions = JSON.parse(res.data.linktOptions);
				if (res.data === "Successful") setLinktUrlVal(true);
				setLoader(false);
			});
	};

	const confirmDelete = (e) => {
		const deleteBtn = document.getElementsByClassName("linkt-delete");
		deleteBtn[0].classList.add("show-confirm");
		setTimeout(function () {
			deleteBtn[0].classList.remove("show-confirm");
		}, 2500);
	};

	const handleDeleteOptions = (e) => {
		e.preventDefault();
		if (
			window.confirm(
				__("Are you sure you want to delete all settings?", "linkt")
			)
		) {
			setLoader(true);
			setLoadSetting(true);
			axios
				.delete(url + "/delete", {
					headers: {
						"X-WP-NONCE": linktObj.nonce,
					},
				})
				.then((res) => {
					setLoader(false);
					location.reload();
				});
		}
	};

	// Get Settings from db
	useEffect(() => {
		axios
			.get(url + "/settings")
			.then((res) => {
				const linktOptions = res.data
					? JSON.parse(res.data)
					: console.log("Linkt Options Empty");

				// setState dynamically for all settings
				if (linktOptions) {
					for (const key in linktOptions) {
						setLinktOptions((prevState) => ({
							...prevState,
							[key]: linktOptions[key] ? linktOptions[key] : "",
						}));
					}
				} else {
					setLinktOptions(linktDefaults); // Set settings to linktDefaults if not found
					// document.querySelector(".linktSaveBtn").click();
				}
				// console.log(linktOptions);
			})
			.then(() => {
				setLoadSetting(false);
			});
	}, []);

	return (
		<React.Fragment>
			<div className="linkt-settings">
				<div className="linktSettingBar">
					<h2>
						{isPremium
							? __("Linkt Pro Settings", "linkt")
							: __("Linkt Settings", "linkt")}
					</h2>
					<div className="linktSettingBarOptions">
						{/* <a
							href={linktObj.accountUrl}
							className="fa-regular fa-user linkt-account"
							title={__("My Account", "linkt")}
						></a> */}
						<a
							href={
								linktObj.adminUrl +
								"edit.php?post_type=linkt&page=linkt-license"
							}
							className={`fa-solid fa-key linkt-upgrade`}
							title={__("Enter your License Key", "linkt")}
						></a>
						{/* <a
							href={linktObj.accountUrl}
							className="fa-solid fa-life-ring linkt-docs"
							title={__("Documentation", "linkt")}
							target="_blank"
						></a> */}
					</div>
				</div>

				{Object.keys(linktOptions).length > 0 &&
					!linktOptions.disablerating && (
						<GiveFeedback
							linktOptions={linktOptions}
							clickClose={handleChange}
						/>
					)}

				<div className="linkt-settings-content">
					<form id="linkt-settings-form" onSubmit={(e) => handleSubmit(e)}>
						<div className="linkt-tabs">
							<ul>
								<li>
									<a
										id="linkttab-1"
										className={`linkt-tab ${activeTab === "1" ? "active" : ""}`}
										onClick={() => changeTab("1")}
									>
										{__("Settings", "linkt")}
									</a>
								</li>
								<li>
									<a
										id="linkttab-2"
										className={`linkt-tab ${activeTab === "2" ? "active" : ""}`}
										onClick={() => changeTab("2")}
									>
										{__("Blocks", "linkt")}
									</a>
								</li>

								<li className="help">
									<a
										id="linkttab-help"
										className={`linkt-tab ${
											activeTab === "help" ? "active" : ""
										}`}
										onClick={() => changeTab("help")}
									>
										{isPremium ? __("Help", "linkt") : __("Go Pro", "linkt")}
									</a>
								</li>
							</ul>

							<div className="linkt-content-wrap">
								<div className="linkt-content-wrap-inner">
									{(loadSetting || loader) && <Loader />}
									<div
										id="linkt-content-1"
										className={`linkt-content ${
											activeTab === "1" ? "active" : ""
										}`}
									>
										<SettingHeader
											title={__("Linkt Settings", "linkt")}
											description={__(
												"Adjust your default settings for Linkt and turn on/off certain features.",
												"linkt"
											)}
										/>

										<table className="form-table" role="presentation">
											<tbody>
												<SettingRow
													title={__("URL Extension", "linkt")}
													slug="settings_url_ext"
													value={linktOptions.settings?.url_ext}
													placeholder="go"
													inputType="text"
													onChange={handleChange}
													note={__(
														"Suggestions: recommends, suggests, visit, explore, discover, refer, view",
														"linkt"
													)}
													{...(linktUrlVal
														? {
																standOutNote: __(
																	"After editing the URL Extension",
																	"linkt"
																),
														  }
														: {})}
												/>

												<SettingRow
													title={__("Dashboard Widget Display", "linkt")}
													slug="settings_dash_display"
													value={linktOptions.settings?.dash_display}
													inputType="select"
													options={{
														single: __("As Single Linkts", "linkt"),
														categs: __("Grouped in Categories", "linkt"),
													}}
													onChange={handleChange}
												/>

												<SettingRow
													title={__("Order By", "linkt")}
													slug="settings_chart_order_by"
													value={linktOptions.settings?.chart_order_by}
													inputType="select"
													options={{
														title:
															linktOptions.settings?.dash_display === "categs"
																? __("Category Names & Post Titles")
																: __("Post Titles"),
														...{
															...(linktOptions.settings?.dash_display ===
															"single"
																? { total_clicks: __("Click Count") }
																: {}),
														},
													}}
													onChange={handleChange}
												/>
												<SettingRow
													title={__("Order", "linkt")}
													slug="settings_chart_order"
													value={linktOptions.settings?.chart_order}
													inputType="select"
													options={{
														asc: __("Ascending", "linkt"),
														desc: __("Descending", "linkt"),
													}}
													onChange={handleChange}
												/>

												<SettingRow
													title={__("Chart Display", "linkt")}
													slug="settings_chart_display"
													value={linktOptions.settings?.chart_display}
													inputType="select"
													options={
														isPremium
															? {
																	"7_days": __("Last 7 Days", "linkt"),
																	"14_days": __("Last 2 Weeks", "linkt"),
																	"30_days": __("Last 30 Days", "linkt"),
																	"3_months": __("Last 3 Months", "linkt"),
																	"12_months": __("Last 12 Months", "linkt"),
															  }
															: {
																	"7_days": __("Last 7 Days", "linkt"),
																	"14_days": __("Last 2 Weeks", "linkt"),
																	"30_days": __("Last 30 Days", "linkt"),
															  }
													}
													onChange={handleChange}
												/>

												<SettingRow
													title={__("Enable Chart", "linkt")}
													slug="settings_chart_enabled"
													value={linktOptions.settings?.chart_enabled}
													inputType="toggle"
													onChange={handleChange}
												/>
												<SettingRow
													title={__("Track Logged In Users", "linkt")}
													slug="settings_track_loggedin"
													value={linktOptions.settings?.track_loggedin}
													inputType="toggle"
													onChange={handleChange}
													note={__(
														"For websites with user accounts, also track users that are logged in.",
														"linkt"
													)}
												/>
											</tbody>
										</table>
									</div>

									<div
										id="linkt-content-2"
										className={`linkt-content ${
											activeTab === "2" ? "active" : ""
										}`}
									>
										<SettingHeader
											title={__("Blockons Editor Blocks", "blockons")}
											description={__(
												"Choose the blocks you'd like to use when building with the WordPress block editor. You can turn off blocks to optimize for speed & page loading.",
												"blockons"
											)}
										/>

										<div className="blockons-block-settings">
											{linktDefaults.blocks &&
												linktOptions &&
												Object.entries(linktDefaults.blocks).map(
													([key, value]) => (
														<SettingBlock
															key={key}
															title={key
																.replaceAll("_", " ")
																.replace("wc", "WC")}
															slug={`blocks_${key}`}
															value={
																// If the setting exists in the saved settings then use it otherwise off by default
																linktOptions && linktOptions.blocks
																	? linktOptions.blocks[key]
																	: false
															}
															inputType="toggle"
															description={
																blockListSettings[key]
																	? blockListSettings[key].desc
																	: ""
															}
															onChange={handleChange}
															pluginSpecific={
																blockListSettings[key]
																	? blockListSettings[key].pluginSpecific
																	: false
															}
															{...(blockListSettings[key] &&
															blockListSettings[key].pluginSpecific ===
																"WooCommerce" &&
															!wcActive
																? { disable: true }
																: "")}
															isNew={
																blockListSettings[key]
																	? blockListSettings[key].isNew
																	: false
															}
														/>
													)
												)}
										</div>
									</div>

									<div
										id="linkt-content-help"
										className={`linkt-content ${
											activeTab === "help" ? "active" : ""
										}`}
									>
										<InfoTab
											adminUrl={linktObj.adminUrl}
											isPro={isPremium}
											// upgrade={linktObj.upgradeUrl}
										/>
									</div>
								</div>

								<div className="linktSettingBar bottom">
									<div className="linktSettingBarMain">
										<button
											type="submit"
											className="button linktSaveBtn button-primary"
										>
											{__("Save Settings", "linkt")}
										</button>
										<div className="linktSaveBtnLoader">
											{(loadSetting || loader) && <Loader />}
										</div>

										{linktUrlVal && (
											<a
												href="options-permalink.php"
												className="stand-out-note-link"
												target="_blank"
											>
												{__("Update the Permalinks", "linkt")}
											</a>
										)}
									</div>
									<div className="linktSettingBarOptions">
										<div
											className="linkt-delete"
											title={__("Reset Settings", "linkt")}
											onClick={confirmDelete}
										>
											<div className="linkt-confirm-delete">
												<a onClick={handleDeleteOptions}>
													{__("Confirm... Reset All Settings!", "linkt")}
												</a>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</form>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Settings;
