import { useRouter } from "next/router";

import LogoutIcon from "@icons/log-out.svg";

export default function LeaveButton() {
	const router = useRouter();

	return (
		<button
			onClick={() => router.replace("/")}
			className="p-4 rounded-full bg-red-600 text-white shadow-md"
		>
			<LogoutIcon />
		</button>
	);
}
