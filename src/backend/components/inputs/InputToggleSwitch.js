import { linktConvertToSlug } from "../../helpers";

const InputToggleSwitch = ({ slug, title, value, onChange }) => {
	const inputTitleSlug = linktConvertToSlug(slug)
		? linktConvertToSlug(slug)
		: linktConvertToSlug(title);
	const isChecked = value ? true : false;

	return (
		<label className="toggle-switch">
			<input
				id={inputTitleSlug}
				name={inputTitleSlug}
				type="checkbox"
				onChange={onChange}
				checked={isChecked}
				className="toggle-switch-checkbox"
			/>
			<span className="toggle-switch-slider"></span>
		</label>
	);
};

export default InputToggleSwitch;
