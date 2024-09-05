const { __ } = wp.i18n;
import axios from "axios";
import Loader from "../Loader";

const UpdateNotice = () => {
	const linktObject = linktObj;
	const url = `${linktObject.apiUrl}linkt-api/v1`;
	const [loader, setLoader] = useState(false);
	const [linktDefaults, setBlockonsDefaults] = useState({});
	const [linktOptions, setBlockonsOptions] = useState({});

	// Get Settings from db
	useEffect(() => {
		setLoader(true);

		axios.get(url + "/defaults").then((res) => {
			const linktDefaults = res.data.linktDefaults
				? JSON.parse(res.data.linktDefaults)
				: console.log("Blockons Options Empty");

			setBlockonsDefaults(linktDefaults); // Set settings to defaults if not found
			// console.log("Defaults Done");
		});

		axios.get(url + "/settings").then((res) => {
			const linktOptions = res.data.linktOptions
				? JSON.parse(res.data.linktOptions)
				: console.log("Blockons Options Empty");

			setBlockonsOptions(linktOptions); // Set settings to defaults if not found
			// console.log("Options Done");
		});

		setLoader(false);
	}, []);

	// Submit form
	const handleUpdate = async (e) => {
		e.preventDefault();
		setLoader(true);

		// console.log(linktDefaults);
		// console.log(linktOptions);

		const mergedOptions = { ...linktDefaults, ...linktOptions };

		await axios
			.post(
				url + "/settings",
				{
					linktOptions: JSON.stringify(mergedOptions),
				},
				{
					// Add Nonce to prevent this working elsewhere
					headers: {
						"content-type": "application/json",
						"X-WP-NONCE": linktObject.nonce,
					},
				}
			)
			.then((res) => {
				// const linktOptions = JSON.parse(res.data.linktOptions);
				setLoader(false);
			});
	};

	return (
		<React.Fragment>
			<div className="linkt-updatenotice">
				<div className="linkt-updatenotice-txt">
					{__("Thanks for updating! Please run the updater now", "linkt")}
				</div>
				<div className="linkt-updatenotice-btn">
					{loader ? (
						<Loader />
					) : (
						<a onClick={(e) => handleUpdate(e)}>{__("Run Update", "linkt")}</a>
					)}
				</div>
			</div>
		</React.Fragment>
	);
};

export default UpdateNotice;
