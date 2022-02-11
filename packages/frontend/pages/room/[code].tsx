import type { Instance } from "simple-peer";
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import useRoom from "hooks/useRoom";
import useRoomSocket from "hooks/useRoomSocket";
import Head from "components/Head";
import MicButton from "components/room/MicButton";
import LeaveButton from "components/room/LeaveButton";
import FullscreenButton from "components/room/FullscreenButton";
import WebcamButton from "components/room/WebcamButton";

function PeerVideo({ peer }: { peer: Instance }) {
	const ref = useRef<HTMLVideoElement>();

	useEffect(() => {
		peer.on("stream", (stream) => (ref.current.srcObject = stream));
	}, [peer]);

	return <video className="rounded-md" ref={ref} autoPlay playsInline />;
}

function UserVideo({ stream }: { stream: MediaStream }) {
	const handleUserVideo = (video: HTMLVideoElement) => video && (video.srcObject = stream);

	return (
		<video
			className="rounded-tr-lg"
			width={200}
			height={150}
			ref={handleUserVideo}
			muted
			autoPlay
			playsInline
		/>
	);
}

function Room() {
	const router = useRouter();
	const { room, error } = useRoom(router.query.code as string);

	const { peers, stream } = useRoomSocket(room?.code);

	if (error) return error;
	if (!room) return <Head title="Loading room..." />;

	return (
		<>
			<Head title={`Room ${room.code}`} />
			<div className="flex flex-col h-screen">
				<div id="enfys-peers" className="flex-1 grid grid-cols-6 gap-4 p-8">
					{peers.map((peer) => (
						<PeerVideo peer={peer} key={peer.id} />
					))}
				</div>
				<div className="flex items-end">
					{stream && <UserVideo stream={stream} />}
					<div className="flex justify-between flex-1 px-8 py-4">
						<div className="flex items-center gap-4">
							<MicButton stream={stream} />
							<WebcamButton />
							<LeaveButton />
						</div>
						<div className="flex items-center gap-4">
							{peers.length > 0 && <FullscreenButton />}
							<div>
								<h5 className="font-semibold text-lg">{room.title}</h5>
								<span className="opacity-75">{room.code}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

Room.getLayout = (page: JSX.Element) => page;

export default Room;
