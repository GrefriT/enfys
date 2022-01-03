const TURN = require("node-turn");

const isDev = process.env.NODE_ENV !== "production";

const fastify = require("fastify").default({
	logger: {
		prettyPrint: isDev
			? {
					translateTime: "HH:MM:ss Z",
					ignore: "pid,hostname,reqId,responseTime,req,res",
					messageFormat: "{msg} {req.url}",
			  }
			: false,
	},
});

fastify.register(require("fastify-cors"), {
	origin: isDev ? "http://localhost:3000" : "https://enfys.app",
});
fastify.register(require("fastify-websocket"));
fastify.register(require("./routes/room"), { prefix: "/room" });

fastify.listen(9453, (err) => {
	if (err) {
		fastify.log.error(err);
		process.exit(1);
	}
});

new TURN().start();
