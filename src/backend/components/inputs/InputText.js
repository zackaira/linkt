<<<<<<< HEAD
import { linktConvertToSlug } from "../../helpers";
=======
import React from "react";
import { mmdConvertToSlug } from "../../helpers";
>>>>>>> 014acdfbeef5dd5d7bc3cd2cdacd60dbb775075c

const InputText = (props) => {
	const inputTitleSlug = mmdConvertToSlug(props.slug)
		? mmdConvertToSlug(props.slug)
		: mmdConvertToSlug(props.title);

	const prefix = props.prefix ? props.prefix : "";
	const suffix = props.suffix ? props.suffix : "";

	return (
		<>
			{prefix && <span className="prefix">{prefix}</span>}
			{props.inputType === "text" ? (
				<input
					type="text"
					id={inputTitleSlug}
					name={inputTitleSlug}
					placeholder={props.placeholder}
					value={props.value || ""}
					onChange={props.onChange}
					className={`regular-text ${props.className || ""}`}
					{...(props.disabled && { disabled: true })}
				/>
			) : props.inputType === "number" ? (
				<input
					type="number"
					id={inputTitleSlug}
					name={inputTitleSlug}
					placeholder={props.placeholder}
					value={props.value || ""}
					onChange={props.onChange}
					className="small-text"
				/>
			) : (
				<textarea
					id={inputTitleSlug}
					name={inputTitleSlug}
					value={props.value || ""}
					placeholder={props.placeholder}
					onChange={props.onChange}
					className="regular-text"
					rows="5"
				></textarea>
			)}
			{suffix && <span className="suffix">{suffix}</span>}
		</>
	);
};

export default InputText;
