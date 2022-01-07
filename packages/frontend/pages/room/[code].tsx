import { useRouter } from "next/router";
import useRoom from "hooks/useRoom";
import useRoomSocket from "hooks/useRoomSocket";
import Head from "components/Head";

function Room() {
	const router = useRouter();
	const { room, error } = useRoom(router.query.code as string);

	useRoomSocket(room?.code);

	if (error) return error;
	if (!room)
		return (
			<>
				<Head title="Loading room..." />
			</>
		);

	return (
		<>
			<Head title={`Room ${room.code}`} />
		</>
	);
}

Room.getLayout = (page: JSX.Element) => page;

export default Room;
