const SettingHeader = ({ title, description }) => {
	return (
		<div className="linkt-header">
			{title && <h3 className="linkt-title">{title}</h3>}
			{description && <p>{description}</p>}
		</div>
	);
};

export default SettingHeader;
