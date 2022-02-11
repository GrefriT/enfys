import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/router";
import useRoom, { Room } from "hooks/useRoom";
import OTPInput from "components/OTPInput";
import Button from "components/Button";
import Wrapper from "components/Wrapper";
import Input from "components/Input";
import fetcher from "lib/fetcher";

function CreateForm({ onReset }: { room?: Room; onReset: () => void }) {
	const router = useRouter();
	const [title, setTitle] = useState("");

	function handleJoin(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		fetcher("/room/create", { method: "POST", body: { title } }).then(({ code }) =>
			router.push(`/room/${code}`)
		);
	}

	return (
		<Wrapper
			title="Create new room"
			action={<Button onClick={onReset}>Join another room</Button>}
			container={<form onSubmit={handleJoin} />}
		>
			<Input
				value={title}
				onChange={(e) => setTitle(e.target.value.trimStart())}
				maxLength={32}
				placeholder="Enter room topic / title"
			/>
			<Button type="submit" disabled={!title}>
				Create room
			</Button>
		</Wrapper>
	);
}

function JoinForm({ code, setCode }: { code: string; setCode: (state: string) => void }) {
	const router = useRouter();
	const { room, isValidating } = useRoom(code);
	const isJoining = !!room || isValidating;

	useEffect(() => {
		if (!room) return;
		router.push(`/room/${room.code}`);
	}, [room, router]);

	return (
		<Wrapper
			title="Join room"
			action={
				<Button disabled={isJoining} onClick={() => setCode(null)}>
					or create new
				</Button>
			}
		>
			<OTPInput disabled={isJoining} value={code} onChange={setCode} length={6} />
			{room && <div className="text-center opacity-75">Joining room {room.title}...</div>}
		</Wrapper>
	);
}

export default function JoinRoom() {
	const [code, setCode] = useState("");

	return code === null ? (
		<CreateForm onReset={() => setCode("")} />
	) : (
		<JoinForm code={code} setCode={setCode} />
	);
}
