import VideocamIcon from "@icons/videocam.svg";
import VideocamOffIcon from "@icons/videocam-off.svg";

export default function WebcamButton() {
	return (
		<button className="p-4 rounded-full bg-white dark:bg-neutral-700 shadow-md">
			<VideocamIcon />
		</button>
	);
}
