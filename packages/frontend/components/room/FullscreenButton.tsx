import ScanIcon from "@icons/scan.svg";

export default function FullscreenButton() {
	function handleRequest() {
		document.getElementById("enfys-peers").requestFullscreen();
	}

	return (
		<button onClick={handleRequest} title="Open fullscreen">
			<ScanIcon />
		</button>
	);
}
