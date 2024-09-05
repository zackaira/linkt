import { __ } from "@wordpress/i18n";
<<<<<<< HEAD
import "./post-type-list.css";
=======
import "./admin-post-type-list.css";
>>>>>>> 014acdfbeef5dd5d7bc3cd2cdacd60dbb775075c

document.addEventListener("DOMContentLoaded", () => {
	const mmdInputs = document.querySelectorAll(".mmd-input");

	mmdInputs.forEach((input) => {
		input.previousElementSibling.addEventListener("click", () => {
			const copyValue = input.value;
			const tooltip = input.nextElementSibling;

			navigator.clipboard
				.writeText(copyValue)
				.then(() => {
					tooltip.innerHTML = __("Copied to Clipboard !", "mmd");

					setTimeout(() => {
						tooltip.innerHTML = __("Copy to Clipboard", "mmd");
					}, 2000);
				})
				.catch((error) => {
					console.error("Could not copy text: ", error);
				});
		});
	});
});
