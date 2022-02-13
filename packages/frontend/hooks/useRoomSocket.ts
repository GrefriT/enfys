import { useState, useEffect, useRef } from "react";
import Peer, { Options } from "simple-peer";
import Socket from "lib/socket";
import type { UserConfig } from "components/room/Lobby";

type UserData = { id: string; name: string };

class User extends Peer {
	public readonly id: string;
	public readonly name: string;

	constructor(peerConfig: Options, data: UserData) {
		super(peerConfig);

		this.id = data.id;
		this.name = data.name;
	}
}

const config: any = {
	iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }],
};

if (process.env.NODE_ENV === "production")
	config.iceServers.push({
		urls: `turn:${process.env.NEXT_PUBLIC_TURN_SERVER}`,
		credential: "any",
		username: "any",
	});

export default function useRoomSocket(code: string, userConfig: UserConfig) {
	const socket = useRef<Socket>();
	const stream = useRef<MediaStream>();
	const peersRef = useRef<Record<string, User>>({});
	const [users, setUsers] = useState<User[]>([]);

	useEffect(() => {
		if (!code) return;

		function createUser(userData: UserData, stream: MediaStream) {
			const user = new User({ initiator: true, stream, config }, userData);

			user.on("signal", (signal) =>
				socket.current.send("send-signal", { calleeId: user.id, signal })
			);

			return user;
		}

		function addUser(incomingSignal: any, caller: UserData, stream: MediaStream) {
			const user = new User({ stream, config }, caller);

			user.on("signal", (signal) =>
				socket.current.send("return-signal", { signal, callerId: user.id })
			).signal(incomingSignal);

			return user;
		}

		const signalPeer = (id: string, signal: any) => peersRef.current[id].signal(signal);

		(async () => {
			stream.current = await navigator.mediaDevices.getUserMedia({
				audio: { deviceId: userConfig.mic },
				video: { deviceId: userConfig.camera },
			});

			function handleAllUsers(usersData: UserData[]) {
				const users = usersData.map((userData) => {
					const user = createUser(userData, stream.current);
					peersRef.current[user.id] = user;
					return user;
				});
				setUsers(users);
			}

			function handleUserJoin(data: any) {
				if (data.caller.id in peersRef.current)
					return signalPeer(data.caller.id, data.signal);

				const user = addUser(data.signal, data.caller, stream.current);
				peersRef.current[user.id] = user;
				setUsers((users) => [...users, user]);
			}

			function handleUserDisconnect(id: string) {
				peersRef.current[id].destroy();
				delete peersRef.current[id];
				setUsers((users) => users.filter((user) => user.id !== id));
			}

			socket.current = new Socket(
				`/room/${code}/socket?name=${encodeURIComponent(userConfig.name)}`
			);
			socket.current
				.add("all-users", handleAllUsers)
				.add("user-joined", handleUserJoin)
				.add("user-disconnected", handleUserDisconnect)
				.add("receive-signal", (data: any) => signalPeer(data.id, data.signal));
		})();

		return () => {
			socket.current?.close();
			stream.current?.getTracks().forEach((track) => track.stop());
		};
	}, [code, userConfig]);

	return { users, stream: stream.current };
}
