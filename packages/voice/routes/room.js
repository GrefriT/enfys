const generateCode = require("../lib/generate-code");

const rooms = {};

function generateRoomCode() {
	const code = generateCode(6);
	if (code in rooms) return generateRoomCode();
	return code;
}

const codeValidationSchema = {
	params: {
		code: { type: "string", pattern: "[A-Z\\d]{6}" },
	},
};

async function route(fastify) {
	fastify.post("/create", () => {
		const code = generateRoomCode();
		rooms[code] = { title: "Untitled room" };
		return { code };
	});

	fastify.get(
		"/socket/:code",
		{ schema: codeValidationSchema, websocket: true },
		(connection, req) => {
			const code = req.params.code;
			if (!(code in rooms)) return connection.socket.close();
		}
	);

	fastify.get("/:code", { schema: codeValidationSchema }, (req, res) => {
		const code = req.params.code;
		if (!(code in rooms)) return res.code(404).send(new Error("Room not found"));
		return { code, title: rooms[code].title };
	});
}

module.exports = route;
