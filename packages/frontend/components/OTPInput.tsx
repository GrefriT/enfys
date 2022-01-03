import { useRef, useState, useEffect, KeyboardEvent, ClipboardEvent } from "react";

type OTPSingle = {
	isActive: boolean;
} & JSX.IntrinsicElements["input"];

function SingleInput({ isActive, ...props }: OTPSingle) {
	const ref = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (!isActive) return;
		ref.current.focus();
	}, [isActive]);

	return (
		<input
			{...props}
			ref={ref}
			autoComplete="off"
			autoCapitalize="off"
			maxLength={1}
			className="w-10 md:w-20 py-2 font-bold text-4xl md:text-7xl text-center bg-transparent border-b-4 border-emerald-500 rounded-none transition focus:border-emerald-600 focus:outline-none disabled:grayscale"
		/>
	);
}

type OTP = {
	length: number;
	value: string;
	disabled?: boolean;
	onChange: (value: string) => void;
};

export default function OTPInput({ length, value, disabled, onChange }: OTP) {
	const [active, setActive] = useState<number | undefined>();

	const getOTPValue = () => value.split("");

	const handleChange = (otp: string[]) => onChange(otp.join("").toUpperCase());

	const focusInput = (distance: number) =>
		setActive((active) => Math.max(Math.min(length - 1, active + distance), 0));

	function changeCodeAtFocus(value: string) {
		const otp = getOTPValue();
		otp[active] = value;
		handleChange(otp);
	}

	function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
		e.preventDefault();

		const otp = getOTPValue();
		const pastedData = e.clipboardData
			.getData("text/plain")
			.slice(0, length - active)
			.split("");

		let nextActive = active;
		for (let pos = 0; pos < length; ++pos)
			if (pos >= active && pastedData.length > 0) {
				otp[pos] = pastedData.shift();
				nextActive++;
			}

		focusInput(nextActive - active);
		handleChange(otp);
	}

	function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Backspace") {
			e.preventDefault();
			changeCodeAtFocus("");
			focusInput(-1);
		} else if (e.key === "Delete") {
			e.preventDefault();
			changeCodeAtFocus("");
		} else if (e.key === "ArrowLeft") {
			e.preventDefault();
			focusInput(-1);
		} else if (e.key === "ArrowRight") {
			e.preventDefault();
			focusInput(1);
		} else if (/[^a-z\d]/i.test(e.key) || e.key === "Spacebar" || e.key === "Space")
			e.preventDefault();
	}

	function renderInputs() {
		const otp = getOTPValue();
		const inputs: JSX.Element[] = [];

		for (let i = 0; i < length; i++) {
			inputs.push(
				<SingleInput
					disabled={disabled}
					value={otp[i] || ""}
					isActive={active === i}
					onKeyDown={handleKeyDown}
					onPaste={handlePaste}
					onChange={(e) => changeCodeAtFocus(e.target.value)}
					onInput={() => focusInput(1)}
					onFocus={(e) => {
						setActive(i);
						e.target.select();
					}}
					key={i}
				/>
			);
		}

		return inputs;
	}

	return <div className="flex gap-2 md:gap-4">{renderInputs()}</div>;
}
