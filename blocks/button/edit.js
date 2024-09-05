import { __ } from "@wordpress/i18n";
import {
	RichText,
	AlignmentToolbar,
	BlockControls,
	InspectorControls,
	BlockAlignmentToolbar,
	useBlockProps,
} from "@wordpress/block-editor";
import {
	PanelBody,
	SelectControl,
	RangeControl,
	ToggleControl,
	TextControl,
	__experimentalUnitControl as UnitControl,
} from "@wordpress/components";
import LinktColorPicker from "../_components/LinktColorPicker";
import { colorPickerPalette } from "../block-global";

const Edit = (props) => {
	const {
		isSelected,
		attributes: {
			alignment,
			buttonText,
			buttonUrl,
			buttonTarget,
			buttonDesign,
			buttonVertPad,
			buttonHorizPad,
			buttonBorderRadius,
			buttonFontSize,
			buttonColor,
			buttonFontColor,
		},
		setAttributes,
	} = props;

	const blockProps = useBlockProps({
		className: `align-${alignment}`,
	});

	return (
		<div {...blockProps}>
			{isSelected && (
				<InspectorControls>
					<PanelBody title={__("Button Settings", "linkt")} initialOpen={true}>
						<TextControl
							label={__("Linkt URL", "linkt")}
							value={buttonUrl}
							onChange={(value) => setAttributes({ buttonUrl: value })}
						/>

						<ToggleControl
							label={__("Open in new tab", "linkt")}
							checked={buttonTarget}
							onChange={(value) => setAttributes({ buttonTarget: value })}
						/>
					</PanelBody>
					<PanelBody title={__("Button Design", "linkt")} initialOpen={false}>
						<SelectControl
							label={__("Button Design", "blockons")}
							value={buttonDesign}
							options={[
								{ label: __("Plain", "blockons"), value: "one" },
								{ label: __("3D Button", "blockons"), value: "two" },
								{ label: __("Inverted", "blockons"), value: "three" },
								{ label: __("Shine", "blockons"), value: "four" },
							]}
							onChange={(value) => setAttributes({ buttonDesign: value })}
						/>
						<div className="linkt-divider"></div>

						<RangeControl
							label={__("Vertical Padding", "linkt")}
							value={buttonVertPad}
							onChange={(value) =>
								setAttributes({
									buttonVertPad: value === undefined ? 12 : value,
								})
							}
							min={0}
							max={100}
						/>
						<RangeControl
							label={__("Horizontal Padding", "linkt")}
							value={buttonHorizPad}
							onChange={(value) =>
								setAttributes({
									buttonHorizPad: value === undefined ? 28 : value,
								})
							}
							min={0}
							max={100}
						/>
						<div className="linkt-divider"></div>
						<RangeControl
							label={__("Border Radius", "linkt")}
							value={buttonBorderRadius}
							onChange={(value) =>
								setAttributes({
									buttonBorderRadius: value === undefined ? 5 : value,
								})
							}
							min={0}
							max={100}
						/>

						<RangeControl
							label={__("Font Size", "linkt")}
							value={buttonFontSize}
							onChange={(value) =>
								setAttributes({
									buttonFontSize: value === undefined ? 15 : value,
								})
							}
							min={0}
							max={42}
						/>

						<div className="linkt-divider"></div>
						<LinktColorPicker
							label={__("Background Color", "linkt")}
							value={buttonColor}
							onChange={(color) => setAttributes({ buttonColor: color })}
							paletteColors={colorPickerPalette}
						/>
						<LinktColorPicker
							label={__("Font Color", "linkt")}
							value={buttonFontColor}
							onChange={(color) => setAttributes({ buttonFontColor: color })}
							paletteColors={colorPickerPalette}
						/>
					</PanelBody>
				</InspectorControls>
			)}
			{
				<BlockControls>
					<BlockAlignmentToolbar
						value={alignment}
						controls={["left", "center", "right"]}
						onChange={(value) => setAttributes({ alignment: value })}
					/>
				</BlockControls>
			}
			<div className={`linkt-button ${buttonDesign}`}>
				<a
					// href={buttonUrl}
					{...(buttonTarget ? { target: "_blank" } : "")}
					className={`linkt-button__a`}
				>
					<RichText
						tagName="div"
						value={buttonText}
						className="linkt-button__text"
						onChange={(value) => setAttributes({ buttonText: value })}
						allowedFormats={["core/bold", "core/italic"]}
						disableLineBreaks
					/>
				</a>
			</div>
		</div>
	);
};

export default Edit;
