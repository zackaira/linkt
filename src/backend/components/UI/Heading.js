const Heading = ({ title, description, nomargin }) => {
	return (
<<<<<<< HEAD
		<div className={`linktheading ${nomargin ? "nomargin" : ""}`}>
			{title && <h4 className="linktheading-title">{title}</h4>}
			{description && <p className="linktheading-desc">{description}</p>}
		</div>
=======
		<React.Fragment>
			<div className={`mmdheading ${nomargin ? "nomargin" : ""}`}>
				{title && <h4 className="mmdheading-title">{title}</h4>}
				{description && (
					<p className="mmdheading-desc">{description}</p>
				)}
			</div>
		</React.Fragment>
>>>>>>> 014acdfbeef5dd5d7bc3cd2cdacd60dbb775075c
	);
};

export default Heading;
