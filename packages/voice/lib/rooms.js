const generateCode = require("./generate-code");

class Room {
	constructor(code, title = "Untitled room") {
		this.code = code;
		this.title = title;
		this.peers = {};
	}

	peer(socket) {}

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
