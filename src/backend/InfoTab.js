const { __ } = wp.i18n;

const InfoTab = ({ adminUrl, isPro }) => {
	return (
		<React.Fragment>
			<div className="linktInfoTab">
				<div className="linkt-header addspace">
					<h3 className="linkt-title">{__("Welcome to Linkt!", "linkt")}</h3>
					<p>
						{__(
							"Linkt is designed to be intuitive, with helpful hints provided throughout the settings. For a more comprehensive understanding, you can also watch this video tutorial on how the Linkt plugin works. Enjoy!",
							"linkt"
						)}
					</p>

					<a
						href="https://zackaira.com/wordpress-plugins/linkt-url-tracking-wordpress-plugin/"
						target="_blank"
						className="linkt-button"
					>
						{__("Visit the Plugin Page", "linkt")}
					</a>

					{!isPro && (
						<a
							href="https://zackaira.com/wordpress-plugins/linkt-url-tracking-wordpress-plugin/#purchase"
							target="_blank"
							className="linkt-button primary"
						>
							{__("Purchase Linkt Pro", "linkt")}
						</a>
					)}
				</div>

				<div className="linkt-video addspace linkt-hide">
					<h3 className="linkt-title">
						{__("Watch our video on using the Linkt plugin", "linkt")}
					</h3>
					{/* <p>
						{__(
							"Linkt is designed to be intuitive, with helpful hints provided throughout the settings. For a more comprehensive understanding, you can also watch this video tutorial on how the Linkt plugin works. Enjoy!",
							"linkt"
						)}
					</p> */}
					<a
						href="https://www.youtube.com/watch?v=4fCIDCcDgaU"
						target="_blank"
						className="linkt-button primary"
					>
						{__("Watch Linkt Video", "linkt")}
					</a>
				</div>

				<div className="linkt-help">
					<h4 className="linkt-title">
						{__("Support & Documentation", "linkt")}
					</h4>

					<p>
						{__(
							"Please watch the video on setting up and using Linkt, or contact me if you need help with anything regarding the plugin.",
							"linkt"
						)}
					</p>

					<a
						href="https://zackaira.com/wordpress-plugins/linkt-url-tracking-wordpress-plugin/#faqs"
						target="_blank"
						className="linkt-button"
					>
						{__("FAQ's", "linkt")}
					</a>
					<a
						href="mailto:z@ckaira.com"
						target="_blank"
						className="linkt-button"
					>
						{__("Email z@ckaira.com", "linkt")}
					</a>
				</div>
			</div>
		</React.Fragment>
	);
};

export default InfoTab;
