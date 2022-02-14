import { useState, ElementType } from "react";

type Mode = "audio" | "video";

type Props = {
	stream: MediaStream;
	addTrack: (track: MediaStreamTrack) => void;
	update: (data: any) => void;
	mode?: Mode;
	OnIcon: ElementType;
	OffIcon: ElementType;
};

function getTracks(stream: MediaStream, mode: Mode) {
	return stream[`get${mode === "video" ? "Video" : "Audio"}Tracks`]();
}

export default function ToggleButton({
	stream,
	addTrack,
	update,
	mode = "audio",
	OnIcon,
	OffIcon,
}: Props) {
	const [enabled, setEnabled] = useState(!!getTracks(stream, mode).length);

	function handleToggle() {
		const track = getTracks(stream, mode)[0];

		if (!track)
			navigator.mediaDevices
				.getUserMedia({ [mode]: true })
				.then((stream) => addTrack(getTracks(stream, mode)[0]))
				.then(() => {
					setEnabled(true);
					update({ [mode]: true });
				});
		else
			setEnabled((enabled) => {
				update({ [mode]: !enabled });
				return (track.enabled = !enabled);
			});
	}

	return (
		<button
			onClick={handleToggle}
			className={`p-4 rounded-full shadow-md transition ${
				enabled ? "bg-white dark:bg-neutral-700" : "bg-red-600 text-white"
			}`}
		>
			{enabled ? <OnIcon /> : <OffIcon />}
		</button>
	);
}
