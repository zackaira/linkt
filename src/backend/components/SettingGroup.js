const SettingGroup = ({ label, children }) => {
	return (
<<<<<<< HEAD
		<tr className="linkt-row linkt-group-row">
			<th>{label}</th>
			<td>
				<div className="linkt-group">
					<a className="linkt-group-btn">
						<span className="dashicons dashicons-edit"></span>
					</a>
					<div className="linkt-group-container">
						<table className="form-table" role="presentation">
							<tbody>{children}</tbody>
						</table>
=======
		<React.Fragment>
			<tr className="mmd-row mmd-group-row">
				<th>{label}</th>
				<td>
					<div className="mmd-group">
						<a className="mmd-group-btn">
							<span className="dashicons dashicons-edit"></span>
						</a>
						<div className="mmd-group-container">
							<table className="form-table" role="presentation">
								<tbody>{children}</tbody>
							</table>
						</div>
>>>>>>> 014acdfbeef5dd5d7bc3cd2cdacd60dbb775075c
					</div>
				</div>
			</td>
		</tr>
	);
};

export default SettingGroup;
