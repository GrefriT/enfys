import { useState } from "react";
import Link from "next/link";
import OTPInput from "components/OTPInput";
import Button from "components/Button";
import Wrapper from "components/Wrapper";

const CODE_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function generateCode(length: number) {
	let code = "";
	for (let i = 0; i < length; ++i)
		code += CODE_CHARSET[Math.round((CODE_CHARSET.length - 1) * Math.random())];

	return code;
}

export default function JoinRoom() {
	const [code, setCode] = useState("");

	return (
		<Wrapper
			title="Join room"
			action={
				<Link href={`/room/${generateCode(6)}?new`} passHref>
					<Button suppressHydrationWarning={true}>or create new</Button>
				</Link>
			}
		>
			<OTPInput value={code} onChange={setCode} length={6} />
		</Wrapper>
	);
}
