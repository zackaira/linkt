const { useState, useEffect } = wp.element;
const { __ } = wp.i18n;
const { testUtils: ReactTestUtils } = wp.element;
import { ChromePicker } from "react-color";
<<<<<<< HEAD
import { linktConvertToSlug } from "../../helpers";
=======
import { mmdConvertToSlug } from "../../helpers";
import { __ } from "@wordpress/i18n";
>>>>>>> 014acdfbeef5dd5d7bc3cd2cdacd60dbb775075c

const ColorPicker = (props) => {
	const colorTitleSlug = mmdConvertToSlug(props.slug)
		? mmdConvertToSlug(props.slug)
		: mmdConvertToSlug(props.title);
	const defaultValue = props.defaultValue ? props.defaultValue : "#BBB";
	const [activeColor, setActiveColor] = useState(defaultValue);
	let allBtns = document.getElementsByClassName("mmdColorPicker");

	useEffect(() => {
		props.value ? setActiveColor(props.value) : defaultValue;
	}, [props.value]);

	const onButtonFocus = (e) => {
		e.preventDefault();
		[...allBtns].forEach(function (item) {
			item.classList.remove("mmdButton-active");
			item.removeAttribute("id");
		});

<<<<<<< HEAD
		e.target.closest(".linktColorPicker").setAttribute("id", "openColorPicker");
		e.target.closest(".linktColorPicker").classList.add("linktButton-active");
=======
		e.target
			.closest(".mmdColorPicker")
			.setAttribute("id", "openColorPicker");
		e.target
			.closest(".mmdColorPicker")
			.classList.add("mmdButton-active");
>>>>>>> 014acdfbeef5dd5d7bc3cd2cdacd60dbb775075c
	};

	window.addEventListener("click", function (e) {
		const isElement = document.getElementById("openColorPicker");

		if (isElement) {
			if (!e.target == isElement || !isElement.contains(e.target)) {
				isElement.removeAttribute("id");
				isElement
					.closest(".mmdColorPicker")
					.classList.remove("mmdButton-active");
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
		<React.Fragment>
			<div className="mmdColorPicker">
				<div className="mmdColorDisplay">
					<button
						className="mmdColorBtn"
						style={{ backgroundColor: activeColor }}
						onClick={(e) => e.preventDefault()}
						onFocus={(e) => onButtonFocus(e)}
						// onBlur={(e) => onButtonBlur(e)}
					>
						<span className="mmdColorBtnTxt">
							{__("Select Color", "mmd")}
						</span>
					</button>
					<input
						type="text"
						id={colorTitleSlug}
						value={activeColor || ""}
						className="mmdColorInput"
						disabled
						onChange={props.onChange}
					/>
				</div>
				<div className="mmdPickColor">
					<ChromePicker
						color={activeColor}
						onChange={(newColor) => handleColorChange(newColor)}
						disableAlpha={true}
						onChangeComplete={(newColor) => changeColor(newColor)}
					/>
				</div>
			</div>
		</React.Fragment>
	);
};

export default ColorPicker;
