import {
	Dropdown,
	Button,
	ColorIndicator,
	ColorPalette,
} from "@wordpress/components";

const LinktColorPicker = (props) => {
	const { label, value, onChange, paletteColors } = props;

	return (
		<Dropdown
			className="linkt-colorpicker"
			contentClassName="linkt-editor-popup linkt-colorpicker-popup"
			popoverProps={{ placement: "bottom-start" }}
			renderToggle={({ isOpen, onToggle }) => (
				<Button
					variant="link"
					onClick={onToggle}
					className="linkt-colorpicker-btn"
				>
					<ColorIndicator colorValue={value} />
					<span>{label}</span>
				</Button>
			)}
			renderContent={() => (
				<ColorPalette
					colors={paletteColors}
					value={value}
					onChange={onChange}
				/>
			)}
		/>
	);
};

export default LinktColorPicker;
