import { useState } from "react";

import Sun from "@icons/sun.svg";
import Moon from "@icons/moon.svg";
import Desktop from "@icons/desktop.svg";

const themes = {
	light: Sun,
	dark: Moon,
	system: Desktop,
};

const themesOrder = {
	system: "light",
	light: "dark",
	dark: "system",
};

export default function ThemeSelector() {
	const [theme, setTheme] = useState<string | null>(localStorage.theme);

	function handleThemeChange() {
		const nextTheme = themesOrder[theme];
		//@ts-ignore
		window.changeTheme(nextTheme);
		setTheme(nextTheme);
	}

	const ThemeIcon = themes[theme || "system"];

	return (
		<button onClick={handleThemeChange} className="opacity-75 hover:opacity-100 transition">
			<ThemeIcon />
		</button>
	);
}
