const SettingHeader = ({ title, description }) => {
	return (
<<<<<<< HEAD
		<div className="linkt-header">
			{title && <h3 className="linkt-title">{title}</h3>}
			{description && <p>{description}</p>}
		</div>
=======
		<React.Fragment>
			<div className="mmd-header">
				{title && <h3 className="mmd-title">{title}</h3>}
				{description && <p>{description}</p>}
			</div>
		</React.Fragment>
>>>>>>> 014acdfbeef5dd5d7bc3cd2cdacd60dbb775075c
	);
};

export default SettingHeader;
