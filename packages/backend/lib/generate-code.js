const CODE_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";

function generateCode(length) {
	let code = "";
	for (let i = 0; i < length; ++i)
		code += CODE_CHARSET[Math.round((CODE_CHARSET.length - 1) * Math.random())];

	return code;
}

module.exports = generateCode;
