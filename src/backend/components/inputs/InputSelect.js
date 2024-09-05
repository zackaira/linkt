<<<<<<< HEAD
import { linktConvertToSlug } from "../../helpers";
=======
import React from "react";
import { mmdConvertToSlug } from "../../helpers";
>>>>>>> 014acdfbeef5dd5d7bc3cd2cdacd60dbb775075c

const InputSelect = (props) => {
	const selectTitleSlug = mmdConvertToSlug(props.slug)
		? mmdConvertToSlug(props.slug)
		: mmdConvertToSlug(props.title);
	const selectOptions = props.options;

	return (
		<>
			<select
				id={selectTitleSlug}
				name={selectTitleSlug}
				onChange={props.onChange}
				value={props.value || props.defaultValue}
				className="snSelect"
			>
				{Object.entries(selectOptions).map(([key, value]) => (
					<option value={key} key={key}>
						{value}
					</option>
				))}
			</select>
		</>
	);
};

export default InputSelect;
