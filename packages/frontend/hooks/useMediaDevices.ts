import { useEffect, useState } from "react";

type DeviceMap = {
	mics?: MediaDeviceInfo[];
	cameras?: MediaDeviceInfo[];
	outputs?: MediaDeviceInfo[];
};

const aliases: Record<MediaDeviceKind, string> = {
	audioinput: "mics",
	audiooutput: "outputs",
	videoinput: "cameras",
};

export default function useMediaDevices() {
	const [devices, setDevices] = useState<DeviceMap>({});

	function updateMediaDevices() {
		navigator.mediaDevices.enumerateDevices().then((mediaDevices) => {
			const state: DeviceMap = { mics: [], cameras: [], outputs: [] };

			mediaDevices.forEach((device) => {
				if (!device.deviceId) return;
				state[aliases[device.kind]].push(device);
			});

			setDevices(state);
		});
	}

	useEffect(() => updateMediaDevices(), []);

	return { ...devices, updateMediaDevices };
}
