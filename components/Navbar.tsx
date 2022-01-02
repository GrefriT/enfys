import Link from "next/link";
import dynamic from "next/dynamic";

const ThemeSelector = dynamic(() => import("components/ThemeSelector"), { ssr: false });

import EnfysLogo from "@icons/enfys-logo.svg";

export default function Navbar() {
	return (
		<nav className="flex items-center justify-between py-4">
			<EnfysLogo />
			<div className="flex items-center gap-4 sm:gap-8">
				<Link href="/privacy">Privacy</Link>
				<Link href="/terms">Terms</Link>
				<ThemeSelector />
			</div>
		</nav>
	);
}
