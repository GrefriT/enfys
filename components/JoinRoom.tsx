import { useState } from "react";
import Link from "next/link";
import OTPInput from "components/OTPInput";
import Button from "components/Button";

const CODE_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function generateCode(length) {
	let code = "";
	for (let i = 0; i < length; ++i)
		code += CODE_CHARSET[Math.round((CODE_CHARSET.length - 1) * Math.random())];

	return code;
}

export default function JoinRoom() {
	const [code, setCode] = useState("");

	return (
		<div className="bg-white dark:bg-neutral-700 rounded-2xl w-fit mx-auto shadow-md">
			<div className="flex items-center justify-between gap-4 p-8 border-b border-neutral-200 dark:border-neutral-600">
				<h3 className="font-bold tracking-wide text-2xl">Join room</h3>
				<Link href={`/room/${generateCode(6)}?new`} passHref>
					<Button suppressHydrationWarning={true}>or create new</Button>
				</Link>
			</div>
			<div className="p-8">
				<OTPInput value={code} onChange={setCode} length={6} />
			</div>
		</div>
	);
}
