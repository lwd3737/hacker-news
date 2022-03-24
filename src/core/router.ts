import { ROUTE_PATHS } from "../config";
import { Params, Query, RouteInfo } from "../types";
import View from "./view";

export default class Router {
	static NUMBER_PATTERN = /(\d+)/;
	static STRING_PATTERN = /(\w+)/;
	static PARAM_PATTERN = /{(\w+):(\w+)}/g;

	static formatParams(params: RouteInfo["params"]): Params {
		return params.reduce((obj: Params, param) => {
			obj[param.name] = param.value;

			return obj;
		}, {});
	}

	static foramtQuery(query: string): Query {
		const searchParams = new URLSearchParams(query);
		const queryObj: Query = {};

		searchParams.forEach((value, key) => {
			queryObj[key] = value;
		});

		return queryObj;
	}

	static parseURL(): { path: string; query: Query | null } {
		const [path, queryStr] = location.hash.slice(1).split("?");
		let query = queryStr ? Router.foramtQuery(queryStr) : null;

		return {
			path,
			query,
		};
	}

	private defaultRoute: {
		page: View | null;
		defaultQuery?: Query;
	} | null;
	private routeTable: RouteInfo[];

	constructor() {
		window.addEventListener("hashchange", this.route.bind(this));

		this.defaultRoute = null;
		this.routeTable = [];
	}

	private addDefaultQueryToURL(path?: string): boolean {
		if (!this.defaultRoute || !this.defaultRoute.defaultQuery) return false;

		const defaultQuery = this.defaultRoute.defaultQuery;
		const { query } = Router.parseURL();
		const newQuery: Query = {
			...defaultQuery,
			...query,
		};
		const queryTuple = Object.keys(newQuery).map((queryName) => [
			queryName,
			newQuery[queryName],
		]);
		const queryStr = queryTuple.reduce((queryStr, [name, value], index) => {
			const isLastIndex = index === queryTuple.length - 1;
			const newQueryStr = `${queryStr}${name}=${value}`;

			if (isLastIndex) return newQueryStr;
			return `${newQueryStr}&`;
		}, "?");

		window.location.hash = path ? path + queryStr : queryStr;
		return true;
	}

	public setDefaultRoute(page: View, defaultQuery?: Query): void {
		this.defaultRoute = {
			page,
			defaultQuery,
		};
	}

	public addRoutePath(path: string, page: View, defaultQuery?: Query) {
		const params: RouteInfo["params"] = [];
		let patternStr = "^" + path + "$";
		let pattern: RegExp = new RegExp(patternStr);
		let matchedParam = Router.PARAM_PATTERN.exec(path);

		while (matchedParam) {
			const paramName = matchedParam[1];

			if (paramName) {
				const paramType = matchedParam[2];
				let typePattern: RegExp;

				switch (paramType) {
					case "number":
						typePattern = Router.NUMBER_PATTERN;
						break;
					case "string":
						typePattern = Router.STRING_PATTERN;
						break;
				}

				if (typePattern) {
					patternStr = patternStr.replace(
						`/${matchedParam[0]}/`,
						typePattern.toString(),
					);

					pattern = new RegExp(patternStr);

					params.push({ name: paramName, value: null });
				}
			}

			matchedParam = Router.PARAM_PATTERN.exec(path);
		}
		this.routeTable.push({ path, page, params, pattern, defaultQuery });
	}

	public redirectDefault(): void {}

	public async route(): Promise<void> {
		const { path, query } = Router.parseURL();

		if ((path === "" || path === ROUTE_PATHS.newsFeeds) && this.defaultRoute) {
			this.addDefaultQueryToURL(ROUTE_PATHS.newsFeeds);
		}

		for (const routeInfo of this.routeTable) {
			const matched = path.match(routeInfo.pattern);
			if (!matched) continue;

			console.log(matched);
			matched.forEach((value, i) => {
				if (i === 0) return;

				const param = routeInfo.params[i - 1];
				param.value = value;
			});

			const params = Router.formatParams(routeInfo.params);

			await routeInfo.page.render({ params, query });

			break;
		}
	}
}
