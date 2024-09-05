const { __ } = wp.i18n;
import InputToggleSwitch from "./inputs/InputToggleSwitch";
import InputSelect from "./inputs/InputSelect";
import InputText from "./inputs/InputText";
import InputRange from "./inputs/InputRange";
import ColorPicker from "./inputs/ColorPicker";
import SettingTooltip from "./UI/SettingTooltip";
import { linktConvertToSlug } from "../helpers";

import Heading from "./UI/Heading";

const SettingRow = (props) => {
	const theTitleSlug = props.slug
		? linktConvertToSlug(props.slug)
		: linktConvertToSlug(props.title);

	let theInput;
	if (props.inputType === "toggle") {
		theInput = <InputToggleSwitch {...props} />;
	} else if (props.inputType === "select") {
		theInput = <InputSelect {...props} />;
	} else if (props.inputType === "range") {
		theInput = <InputRange {...props} />;
	} else if (props.inputType === "colorpicker") {
		theInput = <ColorPicker {...props} />;
	} else if (props.inputType === "heading") {
		return (
			<tr className="linkt-row heading">
				<td colSpan={2}>
					<Heading {...props} />
				</td>
			</tr>
		);
	} else if (props.inputType === "pronote") {
		return (
			<tr className="linkt-row pronote">
				<th>&nbsp;</th>
				<td>
					{props.title && <h6>{props.title}:</h6>}
					{props.desc && <p>{props.desc}</p>}
				</td>
			</tr>
		);
	} else {
		theInput = <InputText {...props} />;
	}

	return (
		<tr className="linkt-row">
			<th scope="row">
				<label htmlFor={props.parent != "" ? theTitleSlug : props.value}>
					{props.title}
				</label>
			</th>
			<td>
				<div className="linkt-row-cols">
					<div className="linkt-row-col-left">
						{theInput}
						{props.note ? <p className="setting-note">{props.note}</p> : ""}
						{props.standOutNote && (
							<>
								<p className="stand-out-note">
									{props.standOutNote}
									<a
										href="options-permalink.php"
										className="stand-out-note-link"
										target="_blank"
									>
										{__("Update the Permalinks", "linkt")}
									</a>
								</p>
							</>
						)}
					</div>
					<div className="linkt-row-col-right">
						{props.tooltip && <SettingTooltip tooltip={props.tooltip} />}

						{props.documentation && (
							<a
								href={props.documentation}
								target="_blank"
								className="linktdoclink"
								title={__("Documentation", "linkt")}
							></a>
						)}
					</div>
				</div>
			</td>
		</tr>
	);
};

export default SettingRow;
