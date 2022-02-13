import { useState } from "react";
import { useRouter } from "next/router";
import useRoom from "hooks/useRoom";
import Head from "components/Head";
import CallRoom from "components/room/CallRoom";
import Lobby, { UserConfig } from "components/room/Lobby";

function RoomPage() {
	const router = useRouter();
	const { room, error } = useRoom(router.query.code as string);

	const [userConfig, setUserConfig] = useState<UserConfig>();

	if (error) return error;
	if (!room) return <Head title="Loading room..." />;

	return (
		<>
			<Head title={`Room ${room.code}`} />
			{userConfig ? (
				<CallRoom userConfig={userConfig} room={room} />
			) : (
				<Lobby room={room} onJoin={setUserConfig} />
			)}
		</>
	);
}

RoomPage.getLayout = (page: JSX.Element) => page;

export default RoomPage;
