import { NewsFeed } from "./types";

const COUNT_PER_PAGE = 12;

export default class Store {
	private _totalPage: number;
	private _currentPage: number;
	private feeds: NewsFeed[];

	constructor() {
		this._totalPage = 0;
		this._currentPage = 1;
		this.feeds = [];
	}

	public get totalPage(): number {
		return this._totalPage;
	}

	public get currentPage(): number {
		return this._currentPage;
	}

	public set currentPage(page: number) {
		if (this._currentPage > this.totalPage) this._currentPage = this.totalPage;
		if (this._currentPage <= 0) this._currentPage = 1;

		this._currentPage = page;
	}

	public get prevPage(): number {
		return this.currentPage > 1 ? this.currentPage - 1 : 1;
	}

	public get nextPage(): number {
		if (this.currentPage + 1 > this.totalPage) return this.totalPage;
		return this.currentPage + 1;
	}

	public get hasFeeds(): boolean {
		return this.feeds.length > 0;
	}

	public setFeeds(feeds: NewsFeed[]): void {
		this.feeds = feeds;
		this._totalPage = Math.floor(feeds.length / COUNT_PER_PAGE);
	}

	public getAllFeeds(): NewsFeed[] {
		return this.feeds;
	}

	public getFeedsOfCurrentPage(): NewsFeed[] {
		const feeds: NewsFeed[] = [];

		for (
			let i = (this.currentPage - 1) * COUNT_PER_PAGE;
			i < this.currentPage * COUNT_PER_PAGE;
			i++
		) {
			const feed = this.feeds[i];

			if (!feed) break;

			feeds.push(feed);
		}

		return feeds;
	}

	public getFeed(): NewsFeed {
		return;
	}
}
