import Api from "../core/api";
import { NewsFeed } from "../types";

export default class NewsFeedApi extends Api {
	public async getData(): Promise<NewsFeed[]> {
		return await this.request<NewsFeed[]>();
	}
}
