import { useState, useEffect, useRef } from "react";
import Peer from "simple-peer";
import Socket from "lib/socket";

export default function useRoomSocket(code: string) {
	const socket = useRef<Socket>();
	const stream = useRef<MediaStream>();
	const peersRef = useRef<[{ id: string; peer: Peer.Instance }?]>([]);
	const [peers, setPeers] = useState<Peer.Instance[]>([]);

	useEffect(() => {
		if (!code) return;

		(async () => {
			stream.current = await navigator.mediaDevices.getUserMedia({
				audio: true,
				video: true,
			});

			socket.current = new Socket(`/room/${code}/socket`);
			socket.current
				.add("id", (id) => (socket.current.id = id))
				.add("all-users", (users) => {
					const peers = [];
					users.forEach((user: string) => {
						const peer = createPeer(user, socket.current.id, stream.current);
						peersRef.current.push({ id: user, peer });
						peers.push(peer);
					});
					setPeers(peers);
				})
				.add("user-joined", (data) => {
					const peer = addPeer(data.signal, data.callerId, stream.current);
					peersRef.current.push({ id: data.callerId, peer });
					setPeers((peers) => [...peers, peer]);
				})
				.add("receive-signal", (data) =>
					peersRef.current.find((peer) => peer.id === data.id).peer.signal(data.signal)
				);
		})();

		return () => {
			socket.current?.close();
			stream.current?.getTracks().forEach((track) => track.stop());
		};
	}, [code]);

	function createPeer(calleeId: string, callerId: string, stream: MediaStream) {
		const peer = new Peer({ initiator: true, stream });
		peer.on("signal", (signal) =>
			socket.current.send("send-signal", { calleeId, callerId, signal })
		);
		return peer;
	}

	function addPeer(incomingSignal: any, callerId: string, stream: MediaStream) {
		const peer = new Peer({ stream });

		peer.on("signal", (signal) => socket.current.send("return-signal", { signal, callerId }));
		peer.signal(incomingSignal);

		return peer;
	}

	return { peers, stream: stream.current };
}
