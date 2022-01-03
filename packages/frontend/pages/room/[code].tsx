import { useRouter } from "next/router";
import useRoom from "hooks/useRoom";
import Head from "components/Head";

function Room() {
	const router = useRouter();
	const { room, error } = useRoom(router.query.code as string);

	if (!room)
		return (
			<>
				<Head title="Loading room..." />
			</>
		);

	if (error) return error;

	return (
		<>
			<Head title={`Room ${room.code}`} />
		</>
	);
}

Room.getLayout = (page: JSX.Element) => page;

export default Room;
