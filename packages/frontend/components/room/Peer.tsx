import { useState, useEffect, useRef } from "react";
import type { User } from "hooks/useRoomSocket";
import hark from "hark";

import ContractIcon from "@icons/contract.svg";
import ExpandIcon from "@icons/expand.svg";

export default function Peer({ peer }: { peer: User }) {
	const [expanded, setExpanded] = useState(true);
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
		<div className="relative flex-1">
			<video
				className={`absolute inset-0 w-full h-full rounded-md border-2 transition ${
					speaking ? "border-emerald-600" : "border-transparent"
				} ${expanded ? "object-cover" : ""}`}
				ref={ref}
				autoPlay
				playsInline
			/>
			<div className="absolute bottom-0 left-0 flex items-center justify-between gap-2 w-full p-2 bg-gradient-to-t from-black/50 to-transparent rounded-md">
				<small>{peer.name}</small>
				<button onClick={() => setExpanded((expanded) => !expanded)}>
					{expanded ? <ExpandIcon /> : <ContractIcon />}
				</button>
			</div>
		</div>
	);
}
