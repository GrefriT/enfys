import { useEffect } from "react";
import { useRouter } from "next/router";
import useRoom from "hooks/useRoom";
import Head from "components/Head";

function Room() {
	const router = useRouter();
	const { room, error } = useRoom(router.query.code as string);

	useEffect(() => {
		if (!room?.code) return;

		const ws = new WebSocket("ws://localhost:9453/room/socket/" + room.code);
		ws.onopen = console.log;
	}, [room?.code]);

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
