const { useState, useEffect } = wp.element;
const { __ } = wp.i18n;
import { getUncategorizedLinkts, sortLinktsDisplayBy } from "../../helpers";
import PostItem from "./PostItem";
import Loader from "../../Loader";

const DashboardCategoriesList = ({ linktObj, options }) => {
	const apiUrl = linktObj.apiUrl;
	const [categoryTree, setCategoryTree] = useState([]);
	const [uncategorizedPosts, setUncategorizedPosts] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		fetchAllCategories();
	}, []);

	const fetchAllCategories = async () => {
		setIsLoading(true);
		try {
			const response = await fetch(`${apiUrl}wp/v2/linkts?per_page=100`);
			if (response.ok) {
				const data = await response.json();

				const tree = buildCategoryTree(data);
				setCategoryTree(tree);

				const allCatIds = data.map((category) => category.id);
				const uncatPosts = await getUncategorizedLinkts(apiUrl, allCatIds);
				setUncategorizedPosts(
					sortLinktsDisplayBy(
						uncatPosts,
						options.chart_order_by,
						options.chart_order
					)
				);
			} else {
				throw new Error("Error fetching categories");
			}
		} catch (error) {
			console.error("Error:", error);
		}
		setIsLoading(false);
	};

	const buildCategoryTree = (categories, parentId = 0) => {
		return categories
			.filter((category) => category.parent === parentId)
			.map((category) => ({
				...category,
				subcategories: buildCategoryTree(categories, category.id),
			}))
			.sort((a, b) => a.name.localeCompare(b.name));
	};

	const fetchPostsByCategory = async (categoryId) => {
		try {
			const response = await fetch(
				`${apiUrl}wp/v2/linkt?linkts=${categoryId}&per_page=100`
			);
			if (!response.ok)
				throw new Error(`Error fetching posts for category ${categoryId}`);
			let posts = await response.json();

			return posts;
		} catch (error) {
			console.error("Error:", error);
			return [];
		}
	};

	const CategoryItem = ({ category }) => {
		const [isOpen, setIsOpen] = useState(false);
		const [posts, setPosts] = useState([]);
		const [isLoadingPosts, setIsLoadingPosts] = useState(false);

		const toggleOpen = async () => {
			setIsOpen(!isOpen);
			if (!isOpen && posts.length === 0) {
				setIsLoadingPosts(true);
				const postsData = await fetchPostsByCategory(category.id);
				setPosts(
					sortLinktsDisplayBy(
						postsData,
						options.chart_order_by,
						options.chart_order
					)
				);
				setIsLoadingPosts(false);
			}
		};

		return (
			<div className="linkt-catitem">
				<div
					className={`linkt-cat-title ${isOpen ? "open" : ""}`}
					onClick={toggleOpen}
				>
					{category.name}
					<i
						className={`fa-solid fa-chevron-right ${
							!isLoadingPosts && isOpen ? "open" : ""
						}`}
					></i>
				</div>
				{isOpen &&
					(isLoadingPosts ? (
						<Loader height={18} width={18} />
					) : (
						<div className="linkt-cat-inner">
							{category.subcategories.length > 0 &&
								category.subcategories.map((subCategory) => (
									<CategoryItem
										key={subCategory.id}
										className="linkt-sub-cat"
										category={subCategory}
									/>
								))}
							{posts.length < 1 ? (
								<NotFound />
							) : (
								<>
									{posts.map((post) => (
										<PostItem key={post.id} post={post} linktObj={linktObj} />
									))}
								</>
							)}
						</div>
					))}
			</div>
		);
	};

	const NotFound = () => {
		return (
			<div className="linkts-not-found">
				{__("No Posts found", "linkt")}
				<a href={linktObj.adminUrl + "post-new.php?post_type=linkt"}>
					{__("Create a Linkt", "linkt")}
				</a>
			</div>
		);
	};

	return (
		<>
			{isLoading ? (
				<div className="linkt-loading">
					<Loader height={35} width={35} />
				</div>
			) : (
				<>
					{categoryTree.length < 1 && uncategorizedPosts.length < 1 ? (
						<NotFound />
					) : (
						<div className="linkt-categories">
							{categoryTree?.map((category) => (
								<CategoryItem key={category.id} category={category} />
							))}
							<div className="linkt-uncategorized">
								{uncategorizedPosts?.map((post) => (
									<PostItem key={post.id} post={post} linktObj={linktObj} />
								))}
							</div>
						</div>
					)}
				</>
			)}
		</>
	);
};

export default DashboardCategoriesList;
