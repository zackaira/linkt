import "./admin.css";

document.addEventListener("DOMContentLoaded", () => {
	// Remove Sub-Categories in Free
	const linktCatParentSelect = document.querySelector(
		"body.wp-admin.taxonomy-linkts.linkt-free .form-field.term-parent-wrap, body.wp-admin.post-type-linkt.linkt-free #taxonomy-linkts .category-add select#newlinkts_parent"
	);
	if (linktCatParentSelect) linktCatParentSelect.remove();

	// Add Pro to Plugin Name on Plugins Page
	const pluginName = document.querySelector(
		"body.wp-admin.plugins-php.linkt-pro tr[data-plugin='linkt/linkt.php'] .plugin-title strong"
	);
	if (pluginName) pluginName.innerHTML = "Linkt Pro";
});
