import View from "../core/view";

export interface Params {
	[key: string]: string | number | null;
}

export interface Query {
	[key: string]: string | number;
}

export interface State {
	[key: string]: any;
}

export interface RouteInfo {
	path: string;
	pattern: RegExp;
	page: View;
	params: { name: string; value: string | number | null }[];
	defaultQuery?: Query;
}

export interface News {
	readonly id: number;
	readonly user: string;
	readonly title?: string;
	readonly content?: string;
	readonly time?: number;
	readonly time_ago: string;
	readonly comments_count: number;
	readonly points?: number;
}

export interface NewsFeed extends News {
	readonly domain: string;
	read?: boolean;
}

export interface NewsDetail extends News {
	readonly domain: string;
	readonly comments: Comment[];
}

export interface NewsComment extends News {
	readonly comments: NewsComment[];
	readonly level: number;
}
