const Rooms = require("../lib/rooms");

const codeValidationSchema = {
	params: {
		code: { type: "string", pattern: "[A-Z\\d]{6}" },
	},
	query: {
		name: { type: "string", maxLength: 32 },
		audio: { type: "boolean" },
		video: { type: "boolean" },
	},
};

async function route(fastify) {
	const rooms = new Rooms();

	fastify.post("/create", (req) => ({ code: rooms.create(req.body.title) }));

	fastify.get(
		"/:code/socket",
		{ schema: codeValidationSchema, websocket: true },
		(connection, req) => {
			const room = rooms.get(req.params.code);
			if (!room) return connection.socket.close();
			room.onPeer(connection.socket, req.query);
		}
	);

	fastify.get("/:code", { schema: codeValidationSchema }, (req, res) => {
		const room = rooms.get(req.params.code);
		if (!room) return res.code(404).send(new Error("Room not found"));
		return room;
	});
}

module.exports = route;
