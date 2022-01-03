export default function Input({ className = "", ...props }: JSX.IntrinsicElements["input"]) {
	return (
		<input
			className={`w-full p-4 rounded-md bg-neutral-200 dark:bg-neutral-900 ${className}`}
			{...props}
		/>
	);
}
