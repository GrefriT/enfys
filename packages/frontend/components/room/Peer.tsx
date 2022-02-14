import { useState, useEffect, useRef } from "react";
import type { User } from "hooks/useRoomSocket";
import hark from "hark";

import ContractIcon from "@icons/contract.svg";
import ExpandIcon from "@icons/expand.svg";
import MicOffIcon from "@icons/mic-off.svg";

export default function Peer({ peer }: { peer: User }) {
	const [expanded, setExpanded] = useState(true);
	const [speaking, setSpeaking] = useState(false);
	const ref = useRef<HTMLVideoElement>();

	useEffect(() => {
		let speechEvents: hark.Harker;

		function startListening(stream: MediaStream) {
			speechEvents = hark(stream);

			speechEvents.on("speaking", () => setSpeaking(true));
			speechEvents.on("stopped_speaking", () => setSpeaking(false));
		}

		peer.on("stream", (stream) => {
			ref.current.srcObject = stream;
			ref.current.play();

			function trackHandler(track: MediaStreamTrack) {
				if (track.kind !== "audio") return;
				startListening(stream);
				peer.off("track", trackHandler);
			}

			if (stream.getAudioTracks().length) startListening(stream);
			else peer.on("track", trackHandler);
		});

		return () => {
			speechEvents?.stop();
			peer.destroy();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [peer.id]);

	return (
		<div className="relative flex-1">
			<video
				className={`absolute inset-0 w-full h-full rounded-md border-2 transition ${
					speaking ? "border-emerald-600" : "border-transparent"
				} ${expanded ? "object-cover" : ""}`}
				ref={ref}
				playsInline
			/>
			{!peer.video && (
				// eslint-disable-next-line @next/next/no-img-element
				<img
					src={`https://avatars.dicebear.com/api/adventurer-neutral/${encodeURIComponent(
						peer.name
					)}.svg`}
					className="absolute inset-0 w-full h-full rounded-md"
					alt="Poster"
				/>
			)}
			<div className="absolute bottom-0 left-0 flex items-center justify-between gap-2 text-white w-full p-2 bg-gradient-to-t from-black/50 to-transparent rounded-md">
				<small>{peer.name}</small>
				<div className="flex items-center gap-2">
					{!peer.audio && <MicOffIcon className="opacity-75" width={18} height={18} />}
					{peer.video && (
						<button onClick={() => setExpanded((expanded) => !expanded)}>
							{expanded ? <ExpandIcon /> : <ContractIcon />}
						</button>
					)}
				</div>
			</div>
		</div>
	);
}
