import type { ReactNode } from "react";
import NextHead from "next/head";

type Props = {
	title: string;
	children?: ReactNode;
};

export default function Head({ title, children }: Props) {
	return (
		<NextHead>
			<title>{title} - Enfys</title>
			{children}
		</NextHead>
	);
}
