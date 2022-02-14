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
		<div id="enfys-users" className="min-h-0 flex-1 flex flex-wrap gap-4 p-8 portrait:flex-col">
			{users.map((user) => (
				<Peer peer={user} key={user.id} />
			))}
		</div>
	);
}

export default function CallRoom({ room, userConfig }: Props) {
	const { users, stream, addTrack } = useRoomSocket(room.code, userConfig);

	return (
		<div className="flex flex-col h-screen">
			<Users users={users} />
			<div className="flex items-end">
				{stream && <UserVideo className="rounded-tr-lg" width={200} stream={stream} />}
				<div className="flex justify-between flex-1 px-8 py-4">
					<div className="flex items-center gap-4">
						{stream && (
							<>
								<ToggleButton
									stream={stream}
									addTrack={addTrack}
									OnIcon={MicIcon}
									OffIcon={MicOffIcon}
								/>
								<ToggleButton
									mode="video"
									stream={stream}
									addTrack={addTrack}
									OnIcon={VideocamIcon}
									OffIcon={VideocamOffIcon}
								/>
							</>
						)}
						<LeaveButton />
					</div>
					<div className="flex items-center gap-4">
						{users.length > 0 && <FullscreenButton />}
						<div>
							<h5 className="font-semibold text-lg">{room.title}</h5>
							<span className="opacity-75">{room.code}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
