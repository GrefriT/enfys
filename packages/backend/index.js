const TURN = require("node-turn");

const isDev = process.env.NODE_ENV !== "production";

const fastify = require("fastify").default({
	logger: {
		prettyPrint: isDev
			? {
					colorize: true,
					translateTime: "HH:MM:ss Z",
					ignore: "pid,hostname,reqId,responseTime,req,res",
					messageFormat: "{msg} {req.url}",
			  }
			: false,
	},
});

if (isDev)
	fastify.register(require("fastify-cors"), {
		origin: "http://localhost:3000",
	});

fastify.register(require("fastify-websocket"));
fastify.register(require("./routes/room"), { prefix: "/api/room" });

fastify.listen(9453, (err) => {
	if (err) {
		fastify.log.error(err);
		process.exit(1);
	}
});

new TURN({ authMech: "long-term", credentials: { any: "any" } }).start();

process.on("uncaughtException", (error) => fastify.log.error(error));
process.on("unhandledRejection", (error) => fastify.log.error(error));
