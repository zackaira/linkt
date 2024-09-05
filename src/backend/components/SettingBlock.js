import InputToggleSwitch from "./inputs/InputToggleSwitch";

const SettingRow = (props) => {
	return (
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
			</div>
		</div>
	);
};

export default SettingRow;
