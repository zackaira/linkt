const { useState, useEffect } = wp.element;
const { __ } = wp.i18n;

const LinktSocialBox = ({ linktObj }) => {
	const [imageUrl, setImageUrl] = useState("");
	const maxLength = 200;

	useEffect(() => {
		if (window.wp && window.wp.media) {
			window.wp.media.frames.file_frame = wp.media({
				title: __("Select or Upload Media", "linkt"),
				button: {
					text: __("Use this media", "linkt"),
				},
				multiple: false,
			});

			window.wp.media.frames.file_frame.on("select", function () {
				const attachment = window.wp.media.frames.file_frame
					.state()
					.get("selection")
					.first()
					.toJSON();
				setImageUrl(attachment.url);

				const input = document.getElementById("_linkt_social_image");
				if (input) {
					input.value = attachment.url;
				}
			});
		}

		// Find the existing textarea and add event listener
		const textarea = document.getElementById("_linkt_social_desc");
		const countSpan = document.querySelector(".linkt-desc-count .count");

		if (textarea && countSpan) {
			countSpan.textContent = textarea.value.length;

			const handleDescriptionChange = (e) => {
				const newLength = e.target.value.length;
				countSpan.textContent = newLength;

				if (newLength > maxLength) {
					textarea.classList.add("linkt-error");
				} else {
					textarea.classList.remove("linkt-error");
				}
			};

			textarea.addEventListener("input", handleDescriptionChange);

			// Cleanup function
			return () => {
				textarea.removeEventListener("input", handleDescriptionChange);
			};
		}
	}, []);

	const handleImageUpload = (e) => {
		e.preventDefault();
		if (window.wp && window.wp.media && window.wp.media.frames.file_frame) {
			window.wp.media.frames.file_frame.open();
		}
	};

	const handleRemoveImage = (e) => {
		e.preventDefault();
		setImageUrl("");

		const input = document.getElementById("_linkt_social_image");
		if (input) {
			input.value = "";
		}
	};

	return (
		<div className="linkt-social-box">
			<div className="linkt-image">
				{imageUrl ? (
					<div className="linkt-image-preview" onClick={handleRemoveImage}>
						<div className="dashicons dashicons-no-alt linkt-image-remove"></div>
						<img src={imageUrl} alt={__("Uploaded image", "linkt")} />
					</div>
				) : (
					<button onClick={handleImageUpload} className="linkt-image-upload">
						{__("Upload Image", "linkt")}
					</button>
				)}
			</div>
			<input type="hidden" name="_linkt_social_image" value={imageUrl} />
		</div>
	);
};

export default LinktSocialBox;
