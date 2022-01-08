import type { Instance } from "simple-peer";
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import useRoom from "hooks/useRoom";
import useRoomSocket from "hooks/useRoomSocket";
import Head from "components/Head";

function PeerVideo({ peer }: { peer: Instance }) {
	const ref = useRef<HTMLVideoElement>();

	useEffect(() => {
		peer.on("stream", (stream) => (ref.current.srcObject = stream));
	}, [peer]);

	return <video className="rounded-md" ref={ref} autoPlay playsInline />;
}

function Room() {
	const router = useRouter();
	const { room, error } = useRoom(router.query.code as string);

	const { peers, stream } = useRoomSocket(room?.code);

	if (error) return error;
	if (!room)
		return (
			<>
				<Head title="Loading room..." />
			</>
		);

	function handleUserVideo(video: HTMLVideoElement) {
		if (!video) return;
		video.srcObject = stream;
	}

	return (
		<>
			<Head title={`Room ${room.code}`} />
			<div className="grid grid-cols-8 gap-4 p-8">
				{stream && <video ref={handleUserVideo} muted autoPlay playsInline />}
				{peers.map((peer, index) => (
					<PeerVideo peer={peer} key={index} />
				))}
			</div>
		</>
	);
}

Room.getLayout = (page: JSX.Element) => page;

export default Room;
