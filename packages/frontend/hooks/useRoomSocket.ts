import { useState, useEffect, useRef } from "react";
import Peer from "simple-peer";
import Socket from "lib/socket";

type Client = Peer.Instance & { id?: string };

const config: any = {
	iceServers: [{ urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"] }],
};

if (process.env.NODE_ENV === "production")
	config.iceServers.push({
		urls: `turn:${process.env.NEXT_PUBLIC_TURN_SERVER}`,
		credential: "any",
		username: "any",
	});

export default function useRoomSocket(code: string) {
	const socket = useRef<Socket>();
	const stream = useRef<MediaStream>();
	const peersRef = useRef<Record<string, Client>>({});
	const [peers, setPeers] = useState<Client[]>([]);

	useEffect(() => {
		if (!code) return;

		function createPeer(calleeId: string, callerId: string, stream: MediaStream) {
			const peer: Client = new Peer({ initiator: true, stream, config });
			peer.id = calleeId;

			peer.on("signal", (signal) =>
				socket.current.send("send-signal", { calleeId, callerId, signal })
			);

			return peer;
		}

		function addPeer(incomingSignal: any, callerId: string, stream: MediaStream) {
			const peer: Client = new Peer({ stream, config });
			peer.id = callerId;

			peer.on("signal", (signal) =>
				socket.current.send("return-signal", { signal, callerId })
			).signal(incomingSignal);

			return peer;
		}

		(async () => {
			stream.current = await navigator.mediaDevices.getUserMedia({
				audio: true,
				video: true,
			});

			function handleAllUsers(users: string[]) {
				const peers = users.map((user) => {
					const peer = createPeer(user, socket.current.id, stream.current);
					peersRef.current[peer.id] = peer;
					return peer;
				});
				setPeers(peers);
			}

			function handleUserJoin(data) {
				const peer = addPeer(data.signal, data.callerId, stream.current);
				peersRef.current[peer.id] = peer;
				setPeers((peers) => [...peers, peer]);
			}

			function handleUserDisconnect(data) {
				peersRef.current[data.id].destroy();
				delete peersRef.current[data.id];
				setPeers((peers) => peers.filter((peer) => peer.id !== data.id));
			}

			socket.current = new Socket(`/room/${code}/socket`);
			socket.current
				.add("id", (id) => (socket.current.id = id))
				.add("all-users", handleAllUsers)
				.add("user-joined", handleUserJoin)
				.add("user-disconnected", handleUserDisconnect)
				.add("receive-signal", (data) => peersRef.current[data.id].signal(data.signal));
		})();

		return () => {
			socket.current?.close();
			stream.current?.getTracks().forEach((track) => track.stop());
		};
	}, [code]);

	return { peers, stream: stream.current };
}
