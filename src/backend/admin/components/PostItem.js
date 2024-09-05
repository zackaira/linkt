<<<<<<< HEAD
const { useState } = wp.element;
const { __ } = wp.i18n;
import DashStats from "./DashStats";
=======
import React, { useState } from "react";
import { __ } from "@wordpress/i18n";
>>>>>>> 014acdfbeef5dd5d7bc3cd2cdacd60dbb775075c

const PostItem = ({ number }) => {
	// const [activeStatsPostId, setActiveStatsPostId] = useState(null);

	return <div className="mmd">{number}</div>;
};

export default PostItem;
