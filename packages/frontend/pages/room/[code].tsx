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

	const handleUserVideo = (video: HTMLVideoElement) => video && (video.srcObject = stream);

	return (
		<>
			<Head title={`Room ${room.code}`} />
			<div className="flex flex-col h-screen">
				<div className="flex-1 grid grid-cols-8 gap-4 p-8">
					{peers.map((peer) => (
						<PeerVideo peer={peer} key={peer.id} />
					))}
				</div>
				<div>
					{stream && (
						<video
							width={200}
							height={150}
							ref={handleUserVideo}
							muted
							autoPlay
							playsInline
						/>
					)}
				</div>
			</div>
		</>
	);
}

Room.getLayout = (page: JSX.Element) => page;

export default Room;
