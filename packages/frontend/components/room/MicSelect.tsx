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
		<div className="space-y-4">
			<div className="flex items-center justify-between gap-8">
				<span className="font-semibold text-lg whitespace-nowrap">Select microphone</span>
				<Switch checked={enabled} onChange={handleSwitchChange} />
			</div>
			{!!mics?.length && (
				<Select
					className="w-full"
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
