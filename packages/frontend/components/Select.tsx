import type { ReactNode, ComponentPropsWithoutRef } from "react";

type Props = {
	className?: string;
	children: ReactNode;
} & ComponentPropsWithoutRef<"select">;

export default function Select({ className = "", children, ...props }: Props) {
	return (
		<select
			className={`rounded-md px-1 py-2 truncate bg-neutral-200 dark:bg-neutral-900 disabled:opacity-75 ${className}`}
			{...props}
		>
			{children}
		</select>
	);
}
