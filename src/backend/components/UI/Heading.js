const Heading = ({ title, description, nomargin }) => {
	return (
		<div className={`linktheading ${nomargin ? "nomargin" : ""}`}>
			{title && <h4 className="linktheading-title">{title}</h4>}
			{description && <p className="linktheading-desc">{description}</p>}
		</div>
	);
};

export default Heading;
