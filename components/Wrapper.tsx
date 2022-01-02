import type { ReactNode } from "react";

type Props = {
	title: string;
	action?: JSX.Element;
	className?: string;
	children: ReactNode;
};

export default function Wrapper({ title, action, className = "", children }: Props) {
	return (
		<div className="bg-white dark:bg-neutral-700 rounded-2xl w-fit mx-auto shadow-md">
			<div className="flex items-center justify-between gap-4 p-4 md:p-8 border-b border-neutral-200 dark:border-neutral-600">
				<h3 className="font-bold tracking-wide text-2xl">{title}</h3>
				{action}
			</div>
			<div className={`p-4 md:p-8 ${className}`}>{children}</div>
		</div>
	);
}
