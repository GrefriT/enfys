class Socket {
	constructor(raw) {
		this.raw = raw;
		this.handlers = {};

		const pingInterval = setInterval(() => {
			this.raw.send("ping");
			this.pingTimeout = setTimeout(() => this.close(), 3500);
		}, 5000);

		this.raw.on("close", () => clearInterval(pingInterval));
		this.raw.on("message", this.handleMessage.bind(this));
	}

	add(type, callback) {
		this.handlers[type] = callback;
		return this;
	}

	remove(type) {
		delete this.handlers[type];
		return this;
	}

	on(event, callback) {
		this.raw.on(event, callback);
		return this;
	}

	send(type, body) {
		this.raw.send(JSON.stringify({ type, body }));
		return this;
	}

	close() {
		this.raw.close();
	}

	handleMessage(buffer) {
		const rawData = buffer.toString();
		if (rawData === "pong") return clearTimeout(this.pingTimeout);
		const data = JSON.parse(rawData.toString());
		this.handlers[data.type]?.(data.body);
	}
}

module.exports = Socket;
