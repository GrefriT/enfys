import type { Room } from "hooks/useRoom";
import useRoomSocket, { User } from "hooks/useRoomSocket";
import type { UserConfig } from "components/room/Lobby";
import LeaveButton from "components/room/LeaveButton";
import FullscreenButton from "components/room/FullscreenButton";
import ToggleButton from "./ToggleButton";
import UserVideo from "components/room/UserVideo";
import Peer from "components/room/Peer";

import MicIcon from "@icons/mic.svg";
import MicOffIcon from "@icons/mic-off.svg";
import VideocamIcon from "@icons/videocam.svg";
import VideocamOffIcon from "@icons/videocam-off.svg";

type Props = {
	room: Room;
	userConfig: UserConfig;
};

function Users({ users }: { users: User[] }) {
	return (
		<div id="enfys-users" className="min-h-0 flex-1 flex flex-wrap gap-4 p-4 portrait:flex-col">
			{users.map((user) => (
				<Peer peer={user} key={user.id} />
			))}
		</div>
	);
}

function AlonePlaceholder({ code }: { code: string }) {
	return (
		<div className="min-h-0 flex-1 flex flex-col justify-center text-center gap-4 p-4">
			<h1 className="text-4xl font-semibold">You are alone in the room 😭</h1>
			<div className="opacity-75">Invite people by this link 🤩</div>
			<div className="text-lg text-emerald-500">https://enfys.app/room/{code}</div>
		</div>
	);
}

export default function CallRoom({ room, userConfig }: Props) {
	const { users, stream, addTrack, update } = useRoomSocket(room.code, userConfig);

	return (
		<div className="flex flex-col h-screen">
			{users.length ? <Users users={users} /> : <AlonePlaceholder code={room.code} />}
			<div className="flex items-center justify-between flex-wrap-reverse gap-8 px-4 py-2">
				<div className="flex items-center gap-4">
					{stream && (
						<>
							<ToggleButton
								stream={stream}
								update={update}
								addTrack={addTrack}
								OnIcon={MicIcon}
								OffIcon={MicOffIcon}
							/>
							<ToggleButton
								mode="video"
								stream={stream}
								update={update}
								addTrack={addTrack}
								OnIcon={VideocamIcon}
								OffIcon={VideocamOffIcon}
							/>
						</>
					)}
					<LeaveButton />
					{users.length > 0 && <FullscreenButton />}
				</div>
				<div className="hidden text-center sm:block">
					<h5 className="hidden font-semibold text-lg sm:block">{room.title}</h5>
					<span className="opacity-75">{room.code}</span>
				</div>
				{stream && (
					<UserVideo
						className="rounded-md aspect-video object-cover bg-black"
						width={160}
						stream={stream}
					/>
				)}
			</div>
		</div>
	);
}
