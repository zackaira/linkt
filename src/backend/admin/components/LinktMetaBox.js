const { useState, useEffect } = wp.element;
const { __ } = wp.i18n;
import {
	linktConvertToSlug,
	getAllPostLinkts,
	sortGetExtraArrayValues,
} from "../../helpers";
import LinktChart from "./LinktChart";
import Loader from "../../Loader";

const LinktMetaBox = ({ linktObj }) => {
	const apiUrl = linktObj.apiUrl;
	const currentPostId = linktObj.currentPostId;
	const isPremium = linktObj.isPremium;
	const legacy = linktObj.legacyOptions;
	const [showMetaBox, setShowMetaBox] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [postData, setPostData] = useState({});
	const [copyText, setCopyText] = useState(__("Copy to Clipboard", "linkt"));

	const [linktUrl, setLinktUrl] = useState(postData?.link);
	const [addTagInputValue, setAddTagInputValue] = useState("");
	const [allLinkts, setAllLinkts] = useState([]);
	const [tagsArray, setTagsArray] = useState([]);
	const [extraTags, setExtraTags] = useState([]);
	const [selectedTag, setSelectedTag] = useState("");
	const rx = /^(https?:\/\/)?[\da-z\.-]+\.[a-z\.]{2,6}/;

	useEffect(() => {
		fetchPostData();
		checkUrlInput();
	}, [currentPostId]);

	useEffect(() => {
		const urlParamsInput = document.getElementById("_linkt_url_params");
		if (urlParamsInput) {
			const tags = urlParamsInput.value ? JSON.parse(urlParamsInput.value) : [];
			setTagsArray(tags);
		}
	}, []);

	useEffect(() => {
		setExtraTags(sortGetExtraArrayValues(tagsArray, allLinkts));
	}, [tagsArray, allLinkts]);

	const fetchPostData = async () => {
		if (currentPostId) {
			try {
				const response = await fetch(`${apiUrl}wp/v2/linkt/${currentPostId}`, {
					headers: {
						"X-WP-Nonce": linktObj.nonce,
					},
					credentials: "same-origin", // Ensure cookies are sent with the request
				});

				if (response.ok) {
					const data = await response.json();

					const result = {
						id: data.id,
						link: data.link,
						total_clicks: data.total_clicks,
					};
					setPostData(result);
					setLinktUrl(result.link);

					// Get ALL linkts for the post
					const postLinkts = await getAllPostLinkts(
						apiUrl,
						data.id,
						linktObj.linktOptions.chart_display
					);
					setAllLinkts(postLinkts);

					// console.log("Post Linkts:", postLinkts);
				} else {
					console.error("Error fetching post data:", response);
				}
			} catch (error) {
				console.error("Error fetching post data:", error);
			}
		} else {
			console.log("Linkt: No current post ID set");
		}
		setIsLoading(false);
	};

	const checkUrlInput = () => {
		const urlInput = document.getElementById("_linkt_redirect");
		if (urlInput) {
			if (urlInput.value !== "" && rx.test(urlInput.value)) {
				setShowMetaBox(true);
			}

			urlInput.addEventListener("input", () => {
				const url = urlInput.value;
				const isValidUrl = rx.test(url);
				setShowMetaBox(isValidUrl);
			});
		}
	};

	/**
	 * Tags functionality
	 */
	const handleTagsInputChange = (e) => {
		setAddTagInputValue(e.target.value);
	};

	const handleAddTag = (e) => {
		e.preventDefault();

		if (addTagInputValue.trim() !== "") {
			const newTag = {
				name: linktConvertToSlug(addTagInputValue.trim(), "-"),
				url: "",
			};

			const newTagsArray = [...tagsArray, newTag];
			setTagsArray(newTagsArray);
			setSelectedTag(newTag.name);

			document.getElementById("_linkt_url_params").value =
				JSON.stringify(newTagsArray);
			setAddTagInputValue("");
		}
	};

	const handleTagInputKeyDown = (e) => {
		if (e.key === "Enter" || e.key === ",") {
			e.preventDefault();
			e.stopPropagation();
			handleAddTag(e);
		}
	};

	// Prevent form submission
	useEffect(() => {
		const form = document.querySelector("form");
		if (form) {
			const preventSubmit = (e) => {
				e.preventDefault();
			};
			form.addEventListener("submit", preventSubmit);
			return () => form.removeEventListener("submit", preventSubmit);
		}
	}, []);

	const handleAddTagUrl = (index) => (e) => {
		const newTagsArray = tagsArray.map((tag, i) => {
			if (i === index) {
				tag.url = e.target.value;
			}
			return tag;
		});
		setTagsArray(newTagsArray);
		document.getElementById("_linkt_url_params").value =
			JSON.stringify(newTagsArray);
	};

	const handleTagClick = (tag) => {
		const linktUrlElement = document.getElementById("linkt-url");
		if (linktUrlElement && postData?.link) {
			if (selectedTag === tag.name) {
				// Unselect the tag
				setLinktUrl(postData?.link); // or set to empty string if you prefer
				setSelectedTag("");
			} else {
				// Select the new tag
				const newUrl = postData?.link + "?tid=" + tag.name;
				setLinktUrl(newUrl);
				setSelectedTag(tag.name);
			}
		}
	};

	const handleTagDelete = async (index) => {
		const confirmDeletion = window.confirm(
			__(
				"Are you sure you want to delete this tag and all tag entries?",
				"linkt"
			)
		);

		if (confirmDeletion) {
			const tagToDelete = tagsArray[index];
			const newTagsArray = tagsArray.filter((_, i) => i !== index);

			try {
				const response = await fetch(`${apiUrl}linkt-api/v1/delete-tags`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"X-WP-Nonce": linktObj.nonce,
					},
					credentials: "same-origin",
					body: JSON.stringify({
						post_id: currentPostId,
						tag_id: tagToDelete.name,
					}),
				});

				if (response.ok) {
					const result = await response.json();
					console.log("Deleted entries:", result.deleted);

					const postLinkts = await getAllPostLinkts(
						apiUrl,
						currentPostId,
						linktObj.linktOptions.chart_display
					);
					setAllLinkts(postLinkts);

					setTagsArray(newTagsArray);
					document.getElementById("_linkt_url_params").value =
						JSON.stringify(newTagsArray);
					setLinktUrl(postData?.link);
					setSelectedTag("");
				} else {
					console.error("Error deleting tag entries:", response);
				}
			} catch (error) {
				console.error("Error deleting tag entries:", error);
			}
		}
	};

	const clearTagSelection = () => {
		setLinktUrl(postData?.link);
		setSelectedTag("");
	};

	/**
	 * Copy URL to clipboard
	 */
	const handleCopyClick = () => {
		if (linktUrl) {
			navigator.clipboard
				.writeText(linktUrl)
				.then(() => {
					setCopyText(__("Copied to Clipboard!", "linkt"));
					setTimeout(() => {
						setCopyText(__("Copy to Clipboard", "linkt"));
					}, 2000);
				})
				.catch((error) => {
					console.error("Could not copy text: ", error);
				});
		}
	};

	if (isLoading) {
		return (
			<div className="linkt-loading">
				<Loader height={35} width={35} />
			</div>
		);
	}

	if (!currentPostId || !showMetaBox) return;

	return (
		<div className="link-meta-box">
			<h5 className="linkt-title">{__("Your new Refer link:", "linkt")}</h5>
			<div className="link-meta-box-input">
				<div
					className="linkt-copy fa-regular fa-copy"
					onClick={handleCopyClick}
				></div>
				<div className="linkt-url" id="linkt-url">
					{linktUrl}
				</div>
				<span className="linkt-tooltip">{copyText}</span>
			</div>

			{tagsArray?.length > 0 && (
				<div className="linkt-tags-wrap">
					<div className="linkt-tags-list">
						<span className="linkt-tag-title">{__("Tags:", "linkt")}</span>
						{tagsArray.map((tag, index) => {
							if (!isPremium && index > 0) {
								return null; // Exit early for non-premium users after the first tag
							}
							return (
								<span
									key={index}
									className={`linkt-tag ${
										selectedTag === tag.name ? "selected" : ""
									}`}
								>
									<span className="linkt-tag-inner">
										<span
											className="linkt-tag-name"
											onClick={() => handleTagClick(tag)}
										>
											{tag.name?.replace(/-/g, " ")}
										</span>
										<span
											className="fa-solid fa-xmark linkt-tag-delete"
											onClick={() => handleTagDelete(index)}
										></span>
									</span>
								</span>
							);
						})}
						{selectedTag && (
							<span className="linkt-tags-clear" onClick={clearTagSelection}>
								{__("clear", "linkt")}
							</span>
						)}
					</div>
					{extraTags && extraTags.length > 0 && (
						<div className="linkt-unrectags-list">
							<span className="linkt-tag-title">
								{__("Unrecognized tags:", "linkt")}
							</span>
							{extraTags.map((tag, index) => (
								<span className="linkt-extratag">{tag.replace(/-/g, " ")}</span>
							))}
						</div>
					)}
					{selectedTag && (
						<div className="linkt-tags-inputs">
							<h5 className="linkt-title">
								{__("Redirect this tag to URL:", "linkt")}
							</h5>
							{tagsArray.map((tag, index) => (
								<div
									key={index}
									className={`linkt-taginput ${
										selectedTag === tag.name ? "selected" : ""
									}`}
								>
									<input
										type="url"
										className={`linkt-taginput-url ${
											rx.test(tag?.url) ? "valid" : "invalid"
										}`}
										value={tag.url}
										onChange={handleAddTagUrl(index)}
									/>
								</div>
							))}
						</div>
					)}
				</div>
			)}

			<div>
				<h5 className="linkt-title">{__("Add Tags:", "linkt")}</h5>
				{(isPremium || (!isPremium && tagsArray.length < 1)) && (
					<>
						<p className="linkt-desc">
							{__("Use tags to organize and track multiple links.", "linkt")}
							{/* <a href="#" className="linkt-desc-a" target="_blank">
								{__("Read How Tags Work", "linkt")}
							</a> */}
						</p>
						<div className="link-tags-add">
							<input
								type="text"
								className="linkt-input add-tag-input"
								value={addTagInputValue}
								onChange={handleTagsInputChange}
								onKeyDown={handleTagInputKeyDown}
								placeholder={__(
									"Type a Tag Name and press Enter or comma",
									"linkt"
								)}
							/>
							{/* <button className="linkt-addtag" onClick={handleAddTag}>
								{__("Add Tag", "linkt")}
							</button> */}
						</div>
					</>
				)}
				{!isPremium && tagsArray.length > 0 && (
					<div className="linkt-premium">
						{__(
							"Upgrade to Linkt Pro (one time payment) to add more tags and get access to premium features.",
							"linkt"
						)}
						<a
							href="https://zackaira.com/wordpress-plugins/linkt-url-tracking-wordpress-plugin/"
							target="_blank"
							className="linkt-premium-link"
						>
							{__("Get Linkt Pro", "linkt")}
						</a>
					</div>
				)}
			</div>

			{allLinkts?.length > 0 && (
				<LinktChart
					apiUrl={apiUrl}
					chartData={allLinkts}
					postId={postData.id}
					tagsArray={tagsArray}
					extraTags={extraTags || []}
					height={300}
					chartDisplay={linktObj.linktOptions.chart_display}
					isPremium={isPremium}
					legacy={legacy}
				/>
			)}

			{allLinkts?.length < 1 && (
				<div className="linkt-no-data">
					{__("No clicks data available for this post yet.", "linkt")}
				</div>
			)}
		</div>
	);
};

export default LinktMetaBox;
