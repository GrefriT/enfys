import { useState, useEffect, useRef } from "react";
import type { Instance } from "simple-peer";
import hark from "hark";

export default function PeerVideo({ peer }: { peer: Instance }) {
	const [speaking, setSpeaking] = useState(false);
	const ref = useRef<HTMLVideoElement>();

	useEffect(() => {
		let speechEvents: hark.Harker;

		peer.on("stream", (stream) => {
			ref.current.srcObject = stream;

			speechEvents = hark(stream);

			speechEvents.on("speaking", () => setSpeaking(true));
			speechEvents.on("stopped_speaking", () => setSpeaking(false));
		});

		return () => speechEvents?.stop();
	}, [peer]);

	return (
		<video
			className={`rounded-md border-2 ${
				speaking ? "border-emerald-600" : "border-transparent"
			}`}
			ref={ref}
			autoPlay
			playsInline
		/>
	);
}
