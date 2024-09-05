const { useState, useEffect } = wp.element;
import { linktConvertToSlug } from "../../helpers";

const InputRange = (props) => {
	const rangeTitleSlug = linktConvertToSlug(props.slug)
		? linktConvertToSlug(props.slug)
		: linktConvertToSlug(props.title);
	const [rangeValue, setRangeValue] = useState(0);
	const theDefault = props.defaultValue ? props.defaultValue : props.min;

	useEffect(() => {
		props.value ? setRangeValue(props.value) : setRangeValue(theDefault);
	}, [props.value]);

	return (
		<div className="linktRange">
			<div className="linktRangeInput">
				<span>{props.min}</span>
				<input
					type="range"
					id={rangeTitleSlug}
					name={rangeTitleSlug}
					onChange={props.onChange}
					value={rangeValue}
					min={props.min ? props.min : 0}
					max={props.max ? props.max : 500}
					step={props.step ? props.step : 1}
				/>
				<span>{props.max ? props.max : 500}</span>
			</div>
			<div className="linktRangeInputVal">
				<input type="text" value={rangeValue} readOnly />
				{props.suffix ? props.suffix : ""}
			</div>
		</div>
	);
};

export default InputRange;
