class Socket {
	constructor(raw) {
		this.raw = raw;
		this.handlers = {};

		const pingInterval = setInterval(() => {
			this.raw.send("ping");
			this.pingTimeout = setTimeout(() => this.close(), 3500);
		}, 5000);

		this.raw.onclose = () => clearInterval(pingInterval);
		this.raw.onmessage = this.handleMessage.bind(this);
	}

	add(type, callback) {
		this.handlers[type] = callback;
		return this;
	}

	remove(type) {
		delete this.handlers[type];
		return this;
	}

	send(type, body) {
		this.raw.send(JSON.stringify({ type, body }));
		return this;
	}

	close() {
		this.raw.close();
	}

	handleMessage(event) {
		if (event.data === "pong") return clearTimeout(this.pingTimeout);
		const data = JSON.parse(event.data);
		this.handlers[data.type]?.(data.body);
	}
}

module.exports = Socket;
