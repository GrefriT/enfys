import useMediaDevices from "hooks/useMediaDevices";
import Switch from "components/Switch";
import Select from "components/Select";

type Props = {
	deviceId: string;
	onChange: (deviceId: string) => void;
};

export default function MicSelect({ deviceId, onChange }: Props) {
	const enabled = !!deviceId;

	const { mics, updateMediaDevices } = useMediaDevices();

	function handleMicChange(deviceId?: string) {
		if (!deviceId)
			navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
				updateMediaDevices();
				onChange(stream.getAudioTracks()[0].getSettings().deviceId);
			});
		else onChange(deviceId);
	}

	function handleSwitchChange() {
		if (enabled) onChange("");
		else handleMicChange(mics[0]?.deviceId);
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<span className="font-semibold text-lg">Microphone</span>
				<Switch checked={enabled} onChange={handleSwitchChange} />
			</div>
			{!!mics?.length && (
				<Select
					value={deviceId}
					onChange={(e) => handleMicChange(e.target.value)}
					disabled={!enabled}
				>
					{mics.map((mic) => (
						<option value={mic.deviceId} key={mic.deviceId}>
							{mic.label}
						</option>
					))}
				</Select>
			)}
		</div>
	);
}
