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
				<div className="linkt-loader-sector linkt-loader-sector-one"></div>
				<div className="linkt-loader-sector linkt-loader-sector-two"></div>
				<div className="linkt-loader-sector linkt-loader-sector-three"></div>
			</div>
		</div>
	);
};

export default Loader;
