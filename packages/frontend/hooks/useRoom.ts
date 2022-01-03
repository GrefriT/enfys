import useSWR from "swr";
import fetcher from "lib/fetcher";

export type Room = { title: string; code: string };

export default function useRoom(code: string): {
	room?: Room;
	isValidating: boolean;
	error?: string;
} {
	const { data, isValidating } = useSWR(code?.length === 6 ? `/room/${code}` : null, { fetcher });

	return {
		room: data?.code && data,
		isValidating,
		error: data?.error && data.message,
	};
}
