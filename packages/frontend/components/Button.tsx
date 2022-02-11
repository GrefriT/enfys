import { forwardRef, ReactNode } from "react";

type Props = {
	children: ReactNode;
} & JSX.IntrinsicElements["button"] &
	JSX.IntrinsicElements["a"];

function Button({ children, ...props }: Props, ref: any) {
	const Component = props.href ? "a" : "button";

	const className =
		"flex-shrink-0 px-4 py-2 rounded-md text-neutral-100 bg-emerald-500 transition hover:bg-emerald-600 active:bg-emerald-700 disabled:bg-neutral-300 dark:disabled:bg-neutral-500 a-no-style";

	return (
		<Component ref={ref} className={className} {...props}>
			{children}
		</Component>
	);
}

export default forwardRef<HTMLButtonElement | HTMLAnchorElement, Props>(Button);
