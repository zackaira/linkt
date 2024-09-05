const { useState, useEffect } = wp.element;
const { __ } = wp.i18n;
import { sortLinktsDisplayBy } from "../../helpers";
import PostItem from "./PostItem";
import Loader from "../../Loader";

const DashboardPostList = ({ linktObj, options }) => {
	const [postData, setPostData] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);

	useEffect(() => {
		fetchPostData();
	}, [currentPage]);

	const fetchPostData = async () => {
		try {
			const response = await fetch(
				`${linktObj.apiUrl}wp/v2/linkt?per_page=10&page=${currentPage}`
			);

			if (response.ok) {
				const data = await response.json();
				const total = response.headers.get("X-WP-TotalPages");

				// console.log("Fetched Data:", data);

				setTotalPages(parseInt(total, 10));
				setPostData(
					sortLinktsDisplayBy(data, options.chart_order_by, options.chart_order)
				);
				setIsLoading(false);
			} else {
				console.error("Error fetching post data:", response);
			}
		} catch (error) {
			console.error("Error fetching post data:", error);
		}
	};

	const handleNextClick = () => {
		setIsLoading(true);
		if (currentPage < totalPages) {
			setCurrentPage(currentPage + 1);
		}
	};

	const handlePreviousClick = () => {
		setIsLoading(true);
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	};

	// console.log("PostData: ", postData);

	return (
		<div className="linkt-dashboard">
			{postData && (
				<>
					<div className="linkt-list">
						<div className="linkt-head">
							<div className="linkt-title">{__("Title", "linkt")}</div>
							<div className="linkt-clicks">{__("Clicks", "linkt")}</div>
							<div className="linkt-actions">{__("Actions", "linkt")}</div>
						</div>
						{isLoading ? (
							<div className="linkt-loading">
								<Loader height={35} width={35} />
							</div>
						) : (
							<div className="linkts">
								{postData.map((post) => {
									return (
										<PostItem key={post.id} post={post} linktObj={linktObj} />
									);
								})}
							</div>
						)}

						<div className="linkt-dash-footer">
							<div className="linkt-footer">
								<a href={`${linktObj.adminUrl}edit.php?post_type=linkt`}>
									{__("View All Linkts", "linkt")}
								</a>
							</div>
							{totalPages > 1 && (
								<div className="linkt-pagination">
									{currentPage !== 1 && (
										<span
											className="fa-solid fa-chevron-left"
											onClick={handlePreviousClick}
										></span>
									)}
									<span>
										{currentPage} / {totalPages}
									</span>
									{currentPage !== totalPages ? (
										<span
											className="fa-solid fa-chevron-right"
											onClick={handleNextClick}
										></span>
									) : (
										<span className="fa-solid"></span>
									)}
								</div>
							)}
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default DashboardPostList;
