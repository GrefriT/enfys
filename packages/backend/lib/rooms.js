const generateCode = require("./generate-code");
const Socket = require("./socket");

const ROOM_TTL = 1000 * 60 * 5;

class User extends Socket {
	constructor(socket, userConfig) {
		super(socket);

		this.id = generateCode(24);
		this.updateConfig(userConfig);
	}

	updateConfig(newConfig) {
		Object.entries(newConfig).forEach(([k, v]) => (this[k] = v));
	}

	toJSON() {
		return { id: this.id, name: this.name, audio: this.audio, video: this.video };
	}
}

class Room {
	constructor(rooms, code, title) {
		this.rooms = rooms;
		this.code = code;
		this.title = title;
		this.peers = {};
	}

	get users() {
		return Object.values(this.peers);
	}

	onPeer(rawSocket, userConfig) {
		clearTimeout(this.destroyTimeout);

		const user = new User(rawSocket, userConfig);

		this.peers[user.id] = user;
		user.send(
			"all-users",
			this.users.filter((peer) => peer.id !== user.id)
		);

		user.add("send-signal", ({ signal, calleeId }) =>
			this.to(calleeId).send("user-joined", { signal, caller: user })
		)
			.add("return-signal", ({ signal, callerId }) =>
				this.to(callerId).send("receive-signal", { signal, id: user.id })
			)
			.add("user-update", (data) => {
				user.updateConfig(data);
				this.broadcast("user-updated", { id: user.id, update: data });
			})
			.on("close", () => {
				delete this.peers[user.id];

				if (!this.users.length) {
					this.destroyTimeout = setTimeout(() => this.rooms.delete(this.code), ROOM_TTL);
					return;
				}

				this.broadcast("user-disconnected", user.id);
			});
	}

	to(peerId) {
		return this.peers[peerId];
	}

	broadcast(type, body) {
		this.users.forEach((peer) => peer.send(type, body));
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
