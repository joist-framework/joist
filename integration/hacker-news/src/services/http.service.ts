export class HttpService {
	fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
		return fetch(input, init);
	}

	fetchJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
		return this.fetch(input, init).then<T>((res) => res.json());
	}
}
