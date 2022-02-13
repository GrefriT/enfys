const generateCode = require("./generate-code");

const ROOM_TTL = 1000 * 60 * 5;

class Room {
	constructor(rooms, code, title) {
		this.rooms = rooms;
		this.code = code;
		this.title = title;
		this.peers = {};
	}

	get users() {
		return Object.keys(this.peers);
	}

	get sockets() {
		return Object.values(this.peers);
	}

	peer(socket) {
		clearTimeout(this.destroyTimeout);

		const id = generateCode(24);

		this.peers[id] = socket;
		socket.send("id", id).send(
			"all-users",
			this.users.filter((user) => user !== id)
		);

		socket
			.add("send-signal", ({ signal, calleeId, callerId }) =>
				this.to(calleeId).send("user-joined", { signal, callerId })
			)
			.add("return-signal", ({ signal, callerId }) =>
				this.to(callerId).send("receive-signal", { signal, id })
			)
			.on("close", () => {
				delete this.peers[id];

				if (!this.users.length) {
					this.destroyTimeout = setTimeout(() => this.rooms.delete(this.code), ROOM_TTL);
					return;
				}

				this.rooms.this.broadcast("user-disconnected", { id });
			});
	}

	to(peerId) {
		return this.peers[peerId];
	}

	broadcast(type, body) {
		this.sockets.forEach((peer) => peer.send(type, body));
	}

	toJSON() {
		return { code: this.code, title: this.title };
	}
}

class Rooms {
	constructor() {
		this.store = {};
	}

	get(code) {
		return this.store[code];
	}

	generateRoomCode() {
		const code = generateCode(6);
		if (this.exists(code)) return generateRoomCode();
		return code;
	}

	create(title) {
		const code = this.generateRoomCode();
		this.store[code] = new Room(this, code, title);
		return code;
	}

	delete(code) {
		return delete this.store[code];
	}

	exists(code) {
		return code in this.store;
	}
}

module.exports = Rooms;
