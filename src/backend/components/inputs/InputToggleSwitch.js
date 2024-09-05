<<<<<<< HEAD
import { linktConvertToSlug } from "../../helpers";
=======
import React from "react";
import { mmdConvertToSlug } from "../../helpers";
>>>>>>> 014acdfbeef5dd5d7bc3cd2cdacd60dbb775075c

const InputToggleSwitch = ({ slug, title, value, onChange }) => {
	const inputTitleSlug = mmdConvertToSlug(slug)
		? mmdConvertToSlug(slug)
		: mmdConvertToSlug(title);
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
