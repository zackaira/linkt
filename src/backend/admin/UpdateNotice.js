const { __ } = wp.i18n;
import axios from "axios";
import Loader from "../Loader";

<<<<<<< HEAD
const UpdateNotice = () => {
	const linktObject = linktObj;
	const url = `${linktObject.apiUrl}linkt-api/v1`;
=======
const Settings = () => {
	const mmdObject = mmdObj;
	const url = `${mmdObject.apiUrl}mmd-api/v1`;
>>>>>>> 014acdfbeef5dd5d7bc3cd2cdacd60dbb775075c
	const [loader, setLoader] = useState(false);
	const [mmdDefaults, setBlockonsDefaults] = useState({});
	const [mmdOptions, setBlockonsOptions] = useState({});

	// Get Settings from db
	useEffect(() => {
		setLoader(true);

		axios.get(url + "/defaults").then((res) => {
			const mmdDefaults = res.data.mmdDefaults
				? JSON.parse(res.data.mmdDefaults)
				: console.log("Blockons Options Empty");

<<<<<<< HEAD
			setBlockonsDefaults(linktDefaults); // Set settings to defaults if not found
			// console.log("Defaults Done");
=======
			setBlockonsDefaults(mmdDefaults); // Set settings to defaults if not found
			console.log("Defaults Done");
>>>>>>> 014acdfbeef5dd5d7bc3cd2cdacd60dbb775075c
		});

		axios.get(url + "/settings").then((res) => {
			const mmdOptions = res.data.mmdOptions
				? JSON.parse(res.data.mmdOptions)
				: console.log("Blockons Options Empty");

<<<<<<< HEAD
			setBlockonsOptions(linktOptions); // Set settings to defaults if not found
			// console.log("Options Done");
=======
			setBlockonsOptions(mmdOptions); // Set settings to defaults if not found
			console.log("Options Done");
>>>>>>> 014acdfbeef5dd5d7bc3cd2cdacd60dbb775075c
		});

		setLoader(false);
	}, []);

	// Submit form
	const handleUpdate = async (e) => {
		e.preventDefault();
		setLoader(true);

		// console.log(mmdDefaults);
		// console.log(mmdOptions);

		const mergedOptions = { ...mmdDefaults, ...mmdOptions };

		await axios
			.post(
				url + "/settings",
				{
					mmdOptions: JSON.stringify(mergedOptions),
				},
				{
					// Add Nonce to prevent this working elsewhere
					headers: {
						"content-type": "application/json",
						"X-WP-NONCE": mmdObject.nonce,
					},
				}
			)
			.then((res) => {
				// const mmdOptions = JSON.parse(res.data.mmdOptions);
				setLoader(false);
			});
	};

	return (
		<React.Fragment>
			<div className="mmd-updatenotice">
				<div className="mmd-updatenotice-txt">
					{__("Thanks for updating! Please run the updater now", "mmd")}
				</div>
				<div className="mmd-updatenotice-btn">
					{loader ? (
						<Loader />
					) : (
						<a onClick={(e) => handleUpdate(e)}>{__("Run Update", "mmd")}</a>
					)}
				</div>
			</div>
		</React.Fragment>
	);
};

export default UpdateNotice;
