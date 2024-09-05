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
			align,
			maxWidth,
			disclosureDesign,
			author,
			authorLink,
			showName,
			showAvatar,
			showTitle,
			disclosureTitle,
			disclosureCopy,
			discVertPad,
			discHorizPad,
		},
		setAttributes,
	} = props;

	const blockProps = useBlockProps({
		className: `align-${alignment} ${align}align`,
	});

	return (
		<div {...blockProps}>
			{isSelected && (
				<InspectorControls>
					<PanelBody
						title={__("Disclosure Settings", "linkt")}
						initialOpen={true}
					>
						<UnitControl
							label={__("Max Width", "blockons")}
							value={maxWidth}
							onChange={(value) => setAttributes({ maxWidth: value })}
							units={[
								{ value: "px", label: "px", default: 600 },
								{ value: "%", label: "%", default: 100 },
							]}
							isResetValueOnUnitChange
						/>
					</PanelBody>
					<PanelBody
						title={__("Disclosure Design", "linkt")}
						initialOpen={false}
					>
						<SelectControl
							label={__("Design", "linkt")}
							value={disclosureDesign}
							options={[
								{ label: "Default", value: "one" },
								{ label: "Minimal", value: "two" },
							]}
							onChange={(value) =>
								setAttributes({
									disclosureDesign: value === undefined ? "one" : value,
								})
							}
						/>

						<RangeControl
							label={__("Vertical Padding", "linkt")}
							value={discVertPad}
							onChange={(value) =>
								setAttributes({
									discVertPad: value === undefined ? 20 : value,
								})
							}
							min={0}
							max={100}
						/>
						<RangeControl
							label={__("Horizontal Padding", "linkt")}
							value={discHorizPad}
							onChange={(value) =>
								setAttributes({
									discHorizPad: value === undefined ? 20 : value,
								})
							}
							min={0}
							max={100}
						/>
					</PanelBody>
				</InspectorControls>
			)}
			{
				<BlockControls>
					<AlignmentToolbar
						value={alignment}
						onChange={(value) =>
							setAttributes({
								alignment: value,
							})
						}
					/>
					<BlockAlignmentToolbar
						value={align}
						controls={["left", "center", "right"]}
						onChange={(value) => setAttributes({ align: value })}
					/>
				</BlockControls>
			}
			<div className={`linkt-disclosure ${disclosureDesign}`}>
				<div
					className="linkt-disclosure-inner"
					style={{
						maxWidth: maxWidth,
						padding: `${discVertPad}px ${discHorizPad}px`,
					}}
				>
					<div className="linkt-disclosure-auth">
						{showName && (
							<RichText
								tagName="p"
								className="linkt-disc-author"
								value={author}
								onChange={() => console.log("changeName")}
								placeholder={__("Author Name", "linkt")}
							/>
						)}
						{showAvatar && (
							<div className="linkt-disc-img">
								<img src="" alt="Author Name" />
							</div>
						)}
					</div>

					<div className="linkt-disclosure-disc">
						{showTitle && (
							<RichText
								tagName="p"
								className="linkt-disc-title"
								value={disclosureTitle}
								onChange={(value) => setAttributes({ disclosureTitle: value })}
								placeholder={__("Title", "linkt")}
							/>
						)}
						<RichText
							tagName="p"
							className="linkt-disc-copy"
							value={disclosureCopy}
							onChange={(value) => setAttributes({ disclosureCopy: value })}
							placeholder={__("Copy", "linkt")}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Edit;
