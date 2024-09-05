import InputToggleSwitch from "./inputs/InputToggleSwitch";

const SettingRow = (props) => {
	return (
<<<<<<< HEAD
		<div className={`linkt-block ${props.disable ? "disabled" : ""}`}>
			<div className="linkt-block-inner">
				{props.isNew && <div className="newbanner">{props.isNew}</div>}
				{props.pluginSpecific && (
					<div className="pluginbanner">{props.pluginSpecific}</div>
				)}

				{props.title && <h4 className="linkt-block-title">{props.title}</h4>}
				{props.description && (
					<p className="linkt-block-desc">{props.description}</p>
				)}
				<InputToggleSwitch {...props} />
=======
		<React.Fragment>
			<div className={`mmd-block ${props.disable ? "disabled" : ""}`}>
				<div className="mmd-block-inner">
					{props.isNew && <div className="newbanner">{props.isNew}</div>}
					{props.pluginSpecific && (
						<div className="pluginbanner">{props.pluginSpecific}</div>
					)}

					{props.title && (
						<h4 className="mmd-block-title">{props.title}</h4>
					)}
					{props.description && (
						<p className="mmd-block-desc">{props.description}</p>
					)}
					<InputToggleSwitch {...props} />
				</div>
>>>>>>> 014acdfbeef5dd5d7bc3cd2cdacd60dbb775075c
			</div>
		</div>
	);
};

export default SettingRow;
