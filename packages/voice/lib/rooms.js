const generateCode = require("./generate-code");

class Room {
	constructor(code, title = "Untitled room") {
		this.code = code;
		this.title = title;
		this.peers = {};
	}

	get users() {
		return Object.keys(this.peers);
	}

	peer(socket) {
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
			.on("close", () => delete this.peers[id]);
	}

	to(peerId) {
		return this.peers[peerId];
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
		this.store[code] = new Room(code, title);
		return code;
	}

	exists(code) {
		return code in this.store;
	}
}

module.exports = Rooms;
