const Loader = ({ height, width }) => {
	const setHeight = height ? height : false;
	const setWidth = width ? width : false;

	return (
		<div className="linkt-loader-wrap">
			<div
				className="linkt-loader"
				{...(setHeight || setWidth
					? {
							style: {
								...(setHeight ? { height: setHeight } : {}),
								...(setWidth ? { width: setWidth } : {}),
							},
					  }
					: {})}
			>
				<div className="linkt-spinner-text"></div>
				<div className="linkt-loader-sector linkt-loader-sector-blue"></div>
				<div className="linkt-loader-sector linkt-loader-sector-pink"></div>
				<div className="linkt-loader-sector linkt-loader-sector-purple"></div>
			</div>
		</div>
	);
};

export default Loader;
