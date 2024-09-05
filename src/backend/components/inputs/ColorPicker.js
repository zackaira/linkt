const { useState, useEffect } = wp.element;
const { __ } = wp.i18n;
const { testUtils: ReactTestUtils } = wp.element;
import { ChromePicker } from "react-color";
import { linktConvertToSlug } from "../../helpers";

const ColorPicker = (props) => {
	const colorTitleSlug = linktConvertToSlug(props.slug)
		? linktConvertToSlug(props.slug)
		: linktConvertToSlug(props.title);
	const defaultValue = props.defaultValue ? props.defaultValue : "#BBB";
	const [activeColor, setActiveColor] = useState(defaultValue);
	let allBtns = document.getElementsByClassName("linktColorPicker");

	useEffect(() => {
		props.value ? setActiveColor(props.value) : defaultValue;
	}, [props.value]);

	const onButtonFocus = (e) => {
		e.preventDefault();
		[...allBtns].forEach(function (item) {
			item.classList.remove("linktButton-active");
			item.removeAttribute("id");
		});

		e.target.closest(".linktColorPicker").setAttribute("id", "openColorPicker");
		e.target.closest(".linktColorPicker").classList.add("linktButton-active");
	};

	window.addEventListener("click", function (e) {
		const isElement = document.getElementById("openColorPicker");

		if (isElement) {
			if (!e.target == isElement || !isElement.contains(e.target)) {
				isElement.removeAttribute("id");
				isElement
					.closest(".linktColorPicker")
					.classList.remove("linktButton-active");
			}
		}
	});

	const handleColorChange = (newColor) => {
		if (typeof newColor === "object" && newColor !== null) {
			setActiveColor(newColor.hex);
		} else {
			setActiveColor(newColor);
		}
	};

	const changeColor = (newColor) => {
		const valueHolderColor = document.getElementById(colorTitleSlug);

		// Simulate onChange event for hidden input
		ReactTestUtils.Simulate.change(valueHolderColor, {
			target: {
				name: colorTitleSlug,
				value:
					typeof newColor === "object" && newColor !== null
						? newColor.hex
						: newColor,
			},
		});
	};

	return (
		<div className="linktColorPicker">
			<div className="linktColorDisplay">
				<button
					className="linktColorBtn"
					style={{ backgroundColor: activeColor }}
					onClick={(e) => e.preventDefault()}
					onFocus={(e) => onButtonFocus(e)}
					// onBlur={(e) => onButtonBlur(e)}
				>
					<span className="linktColorBtnTxt">
						{__("Select Color", "linkt")}
					</span>
				</button>
				<input
					type="text"
					id={colorTitleSlug}
					value={activeColor || ""}
					className="linktColorInput"
					disabled
					onChange={props.onChange}
				/>
			</div>
			<div className="linktPickColor">
				<ChromePicker
					color={activeColor}
					onChange={(newColor) => handleColorChange(newColor)}
					disableAlpha={true}
					onChangeComplete={(newColor) => changeColor(newColor)}
				/>
			</div>
		</div>
	);
};

export default ColorPicker;
