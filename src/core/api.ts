export default class Api {
	private url: string;

	constructor(url: string) {
		this.url = url;
	}

	public async request<AjaxResponse>(): Promise<AjaxResponse> {
		const res = await fetch(this.url);

		return await res.json();
	}
}
