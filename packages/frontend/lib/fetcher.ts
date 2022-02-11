export default function fetcher(url: string, options?: Omit<RequestInit, "body"> & { body?: any }) {
	if (options?.body) {
		options.body = JSON.stringify(options.body);
		options.headers = { "Content-Type": "application/json" };
	}

	return fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, options).then((res) => res.json());
}
