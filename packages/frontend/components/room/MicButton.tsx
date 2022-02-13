import { useState } from "react";

import MicIcon from "@icons/mic.svg";
import MicOffIcon from "@icons/mic-off.svg";

type Props = { stream: MediaStream };

export default function MicButton({ stream }: Props) {
	const [enabled, setEnabled] = useState(true);

	function handleToggle() {
		if (!stream) return;

		setEnabled((enabled) => {
			stream.getAudioTracks()[0].enabled = !enabled;
			return !enabled;
		});
	}

	return (
		<button
			onClick={handleToggle}
			className={`p-4 rounded-full shadow-md transition ${
				enabled ? "bg-white dark:bg-neutral-700" : "bg-red-600"
			}`}
		>
			{enabled ? <MicIcon /> : <MicOffIcon />}
		</button>
	);
}
