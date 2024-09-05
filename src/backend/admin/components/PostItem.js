const { useState } = wp.element;
const { __ } = wp.i18n;

const PostItem = ({ number }) => {
	// const [activeStatsPostId, setActiveStatsPostId] = useState(null);

	return (
		<div className="post-item">
			<div className="post-item__title">Post {number}</div>
			<div className="post-item__stats">
				<div className="post-item__stat">
					<div className="post-item__stat-title">Clicks</div>
					<div className="post-item__stat-value">0</div>
				</div>
				<div className="post-item__stat">
					<div className="post-item__stat-title">Unique Clicks</div>
					<div className="post-item__stat-value">0</div>
				</div>
			</div>
		</div>
	);
};

export default PostItem;
