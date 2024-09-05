const { useState, useEffect } = wp.element;
const { __ } = wp.i18n;
import LinktChart from "./LinktChart";
import { getAllPostLinkts } from "../../helpers";
import Loader from "../../Loader";

const DashStats = ({ postId, apiUrl, showCopied, chartDisplay }) => {
	const [postData, setPostData] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [allLinkts, setAllLinkts] = useState([]);
	const [showUrl, setShowUrl] = useState({});
	const [tagsArray, setTagsArray] = useState([]);

	useEffect(() => {
		fetchPostData(postId);
	}, [postId]);

	const fetchPostData = async (postId) => {
		try {
			const response = await fetch(`${apiUrl}wp/v2/linkt/${postId}`);
			if (response.ok) {
				const data = await response.json();
				// console.log("fetched data", data);

				// Extract the required fields
				const result = {
					id: data.id,
					link: data.link,
					redirect_url: data.redirect_url,
					linkt_tags: data.linkt_tags,
					// total: data.total_clicks,
				};

				setPostData(result);
				setTagsArray(JSON.parse(data.linkt_tags));

				const postLinkts = await getAllPostLinkts(apiUrl, postId, chartDisplay);
				setAllLinkts(postLinkts);
			} else {
				console.error("Error fetching post data:", response);
			}
		} catch (error) {
			console.error("Error fetching post data:", error);
		}
		setIsLoading(false);
	};

	const handleUrlClick = (postId) => {
		setShowUrl((prevShowUrl) => ({
			...prevShowUrl,
			[postId]: !prevShowUrl[postId],
		}));
	};

	if (isLoading) {
		return (
			<div className="linkt-loading">
				<Loader height={35} width={35} />
			</div>
		);
	}

	return (
		<div className="linkt-dash-stats">
			<div className="linkt-dash-stats-url">
				<div className={`linkt-dash-url ${showCopied ? "copied" : ""}`}>
					<span
						className="linkt-action fa-solid fa-shuffle"
						onClick={() => handleUrlClick(postId)}
					></span>
					{showUrl[postId] ? (
						<div className="linkt-url">{postData.redirect_url}</div>
					) : (
						<div className="linkt-url">{postData.link}</div>
					)}
					{showUrl[postId] && (
						<span className="linkt-url-note">
							{__("Redirects to", "linkt")}
						</span>
					)}
				</div>
			</div>

			<LinktChart
				apiUrl={apiUrl}
				chartData={allLinkts}
				postId={postId}
				tagsArray={tagsArray}
				height={160}
				hidePeriod={true}
				chartDisplay={chartDisplay}
			/>
		</div>
	);
};

export default DashStats;
