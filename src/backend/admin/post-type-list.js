import { __ } from "@wordpress/i18n";
import "./post-type-list.css";

document.addEventListener("DOMContentLoaded", () => {
	const linktInputs = document.querySelectorAll(".linkt-input");

	linktInputs.forEach((input) => {
		input.previousElementSibling.addEventListener("click", () => {
			const copyValue = input.value;
			const tooltip = input.nextElementSibling;

			navigator.clipboard
				.writeText(copyValue)
				.then(() => {
					tooltip.innerHTML = __("Copied to Clipboard !", "linkt");

					setTimeout(() => {
						tooltip.innerHTML = __("Copy to Clipboard", "linkt");
					}, 2000);
				})
				.catch((error) => {
					console.error("Could not copy text: ", error);
				});
		});
	});
});
