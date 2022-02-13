import type { ReactNode, ComponentPropsWithoutRef } from "react";

type Props = {
	children: ReactNode;
} & ComponentPropsWithoutRef<"select">;

export default function Select({ children, ...props }: Props) {
	return (
		<select
			className="rounded-md px-1 py-2 truncate max-w-xs bg-neutral-200 dark:bg-neutral-900"
			{...props}
		>
			{children}
		</select>
	);
}
