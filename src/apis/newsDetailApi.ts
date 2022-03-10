import Api from "../core/api";
import { NewsDetail } from "../types";

export default class NewsDetailApi extends Api {
	public async getData(): Promise<NewsDetail> {
		return await this.request<NewsDetail>();
	}
}
