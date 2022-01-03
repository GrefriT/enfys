import { createElement, forwardRef, ReactNode } from "react";

type Props = {
	children: ReactNode;
} & JSX.IntrinsicElements["button"] &
	JSX.IntrinsicElements["a"];

function Button({ children, ...props }: Props, ref: object) {
	const className =
		"flex-shrink-0 px-4 py-2 rounded-md text-neutral-100 bg-emerald-500 transition hover:bg-emerald-600 active:bg-emerald-700 disabled:bg-neutral-300 dark:disabled:bg-neutral-500 a-no-style";

	return createElement(
		props.href ? "a" : "button",
		{
			ref,
			className,
			...props,
		},
		children
	);
}

export default forwardRef<HTMLButtonElement | HTMLAnchorElement, Props>(Button);
