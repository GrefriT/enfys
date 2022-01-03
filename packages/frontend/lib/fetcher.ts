export default function fetcher(
	url: string,
	options?: Omit<RequestInit, "body"> & { body?: object }
) {
	return fetch(process.env.NEXT_PUBLIC_API_URL + url, {
		...options,
		body: options?.body && JSON.stringify(options.body),
	}).then((res) => res.json());
}
