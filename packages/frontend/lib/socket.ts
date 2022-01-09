export default class Socket {
	public instance: WebSocket;
	public id?: string;
	private handlers: object;

	constructor(path: string) {
		const url = `ws${location.protocol === "https:" ? "s" : ""}://${
			process.env.NEXT_PUBLIC_API_DOMAIN
		}${path}`;

		this.instance = new WebSocket(url);
		this.handlers = {};

		this.instance.onmessage = this.handleMessage.bind(this);
	}

	add(type: string, callback: (body) => void) {
		this.handlers[type] = callback;
		return this;
	}

	remove(type: string) {
		delete this.handlers[type];
		return this;
	}

	send(type: string, body?: object) {
		this.instance.send(JSON.stringify({ type, body }));
		return this;
	}

	close() {
		this.instance.close();
	}

	private handleMessage(event: MessageEvent<any>) {
		if (event.data === "ping") return this.instance.send("pong");
		const data = JSON.parse(event.data);
		this.handlers[data.type]?.(data.body);
	}
}
