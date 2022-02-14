import { useState } from "react";
import useMediaDevices from "hooks/useMediaDevices";
import Switch from "components/Switch";
import Select from "components/Select";
import UserVideo from "components/room/UserVideo";

import VideocamOff from "@icons/videocam-off.svg";

function VideoPlaceholder() {
	return (
		<div className="flex flex-col items-center aspect-video justify-center space-y-4 rounded-md bg-neutral-100 dark:bg-neutral-600">
			<VideocamOff className="opacity-75" width={64} height={64} />
			<span className="text-center opacity-75">Your camera is disabled</span>
		</div>
	);
}

type Props = {
	deviceId: string;
	onChange: (deviceId: string) => void;
};

export default function CameraSelect({ deviceId, onChange }: Props) {
	const [stream, setStream] = useState<MediaStream>(null);
	const enabled = !!deviceId;

	const { cameras, updateMediaDevices } = useMediaDevices();

	function handleStreamChange(id: string) {
		stream?.getTracks().forEach((track) => track.stop());
		onChange(id);
	}

	function captureCameraStream(deviceId?: string) {
		navigator.mediaDevices.getUserMedia({ video: { deviceId } }).then((stream) => {
			if (!deviceId) updateMediaDevices();
			handleStreamChange(stream.getVideoTracks()[0].getSettings().deviceId);
			setStream(stream);
		});
	}

	function handleVideoChange() {
		if (enabled) {
			handleStreamChange("");
			setStream(null);
		} else captureCameraStream(cameras[0]?.deviceId);
	}

	return (
		<div className="w-96 max-w-full p-4 space-y-8">
			{stream ? (
				<UserVideo
					stream={stream}
					className="rounded-md object-cover aspect-video w-full"
				/>
			) : (
				<VideoPlaceholder />
			)}
			<div className="flex items-center justify-between gap-4">
				<Switch checked={enabled} onChange={handleVideoChange} />
				{!!cameras?.length && (
					<div className="flex-1">
						<Select
							disabled={!enabled}
							value={deviceId}
							onChange={(e) => captureCameraStream(e.target.value)}
						>
							{cameras.map((camera) => (
								<option value={camera.deviceId} key={camera.deviceId}>
									{camera.label}
								</option>
							))}
						</Select>
					</div>
				)}
			</div>
		</div>
	);
}
