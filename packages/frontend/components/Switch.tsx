import { Switch as BaseSwitch } from "@headlessui/react";

type Props = {
	checked?: boolean;
	onChange: () => void;
};

export default function Switch({ checked, onChange }: Props) {
	return (
		<BaseSwitch
			checked={checked}
			onChange={onChange}
			className="h-6 w-12 bg-neutral-200 dark:bg-neutral-900 rounded-full cursor-pointer"
		>
			<div
				aria-hidden="true"
				className={`${
					checked ? "translate-x-full bg-emerald-600" : "bg-neutral-400"
				} pointer-events-none h-6 w-6 rounded-full transition`}
			/>
		</BaseSwitch>
	);
}
