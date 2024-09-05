const SettingGroup = ({ label, children }) => {
	return (
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
					</div>
				</div>
			</td>
		</tr>
	);
};

export default SettingGroup;
