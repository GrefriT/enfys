const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
	content: ["./pages/**/*.tsx", "./components/**/*.tsx", "./layouts/**/*.tsx"],
	darkMode: "class",
	theme: {
		extend: {
			fontFamily: {
				sans: ["Inter", ...fontFamily.sans],
			},
		},
	},
	plugins: [require("@tailwindcss/typography")],
};
