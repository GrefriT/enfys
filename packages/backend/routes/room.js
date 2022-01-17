const Rooms = require("../lib/rooms");
const Socket = require("../lib/socket");

const codeValidationSchema = {
	params: {
		code: { type: "string", pattern: "[A-Z\\d]{6}" },
	},
};

async function route(fastify) {
	const rooms = new Rooms();

	fastify.post("/create", () => ({ code: rooms.create() }));

	fastify.get(
		"/:code/socket",
		{ schema: codeValidationSchema, websocket: true },
		(connection, req) => {
			const room = rooms.get(req.params.code);
			if (!room) return connection.socket.close();
			room.peer(new Socket(connection.socket));
		}
	);

	fastify.get("/:code", { schema: codeValidationSchema }, (req, res) => {
		const room = rooms.get(req.params.code);
		if (!room) return res.code(404).send(new Error("Room not found"));
		return room;
	});
}

module.exports = route;
