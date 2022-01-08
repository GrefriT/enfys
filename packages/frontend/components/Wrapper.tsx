import { cloneElement, ReactNode } from "react";

type Props = {
	title: string;
	action?: JSX.Element;
	container?: JSX.Element;
	children: ReactNode;
};

export default function Wrapper({ title, action, container, children }: Props) {
	const baseClassName = "flex flex-col gap-4 p-4 md:p-8";
	return (
		<div className="bg-white dark:bg-neutral-700 rounded-2xl w-fit mx-auto shadow-md">
			<div className="flex items-center justify-between gap-8 p-4 md:p-8 border-b border-neutral-200 dark:border-neutral-600">
				<h3 className={`font-bold tracking-wide text-2xl ${action ? "truncate" : ""}`}>
					{title}
				</h3>
				{action}
			</div>
			{container ? (
				cloneElement(
					container,
					{ className: `${baseClassName} ${container.props.className}` },
					children
				)
			) : (
				<div className={baseClassName}>{children}</div>
			)}
		</div>
	);
}
