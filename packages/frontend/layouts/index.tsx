import type { ReactNode } from "react";
import Navbar from "components/Navbar";

export default function DefaultLayout({ children }: { children: ReactNode }) {
	return (
		<div className="container mx-auto px-4 pb-8 space-y-12">
			<Navbar />
			{children}
		</div>
	);
}
