import { useEffect, useRef } from "react";
import Peer from "simple-peer";
import Socket from "lib/socket";

export default function useRoomSocket(code: string) {
	const socket = useRef<Socket>();

	useEffect(() => {
		if (!code) return;

		socket.current = new Socket(`/room/${code}/socket`);

		return () => socket.current.close();
	}, [code]);
}
