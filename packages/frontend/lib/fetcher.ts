export default function fetcher(
	url: string,
	options?: Omit<RequestInit, "body"> & { body?: object }
) {
	const input = `http${
		typeof window !== "undefined" && location.protocol === "https:" ? "s" : ""
	}://${process.env.NEXT_PUBLIC_API_DOMAIN}${url}`;

	return fetch(input, { ...options, body: options?.body && JSON.stringify(options.body) }).then(
		(res) => res.json()
	);
}
