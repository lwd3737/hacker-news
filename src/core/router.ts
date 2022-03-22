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
		let queryObj: Query = {};

		for (const [key, value] of searchParams) {
			queryObj[key] = value;
		}

		return queryObj;
	}

	static addDefaultQueryToURL(query: Query, defaultQuery: Query): boolean {
		const queryCount = Object.keys(defaultQuery).length;

		if (queryCount === 1) {
			const queryName = Object.keys(defaultQuery)[0];

			if (query && queryName in query) {
				return false;
			}

			if (!query) {
				query = {
					[queryName]: defaultQuery[queryName],
				};
			} else if (!(queryName in query)) {
				query[queryName] = defaultQuery[queryName];
			}

			const queryStr =
				"?" +
				Object.keys(query)
					.map((queryName) => `${queryName}=${query[queryName]}`)
					.join("&");

			location.hash += queryStr;

			return true;
		}
	}

	private defaultRoute: {
		page: View | null;
		defaultQuery?: Query;
	};
	private routeTable: RouteInfo[];

	constructor() {
		window.addEventListener("hashchange", this.route.bind(this));

		this.defaultRoute = null;
		this.routeTable = [];
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

	public async route(): Promise<void> {
		const [routePath, queryStr] = location.hash.slice(1).split("?");
		let query = queryStr ? Router.foramtQuery(queryStr) : null;

		if (routePath === "" && this.defaultRoute) {
			if (this.defaultRoute.defaultQuery) {
				const added = Router.addDefaultQueryToURL(
					query,
					this.defaultRoute.defaultQuery,
				);

				if (added) return;
			}

			this.defaultRoute.page.render();
			return;
		}

		for (const routeInfo of this.routeTable) {
			const matched = routePath.match(routeInfo.pattern);

			if (matched) {
				matched.forEach((value, i) => {
					if (i === 0) return;

					const param = routeInfo.params[i - 1];
					param.value = value;
				});

				const params = Router.formatParams(routeInfo.params);

				if (routeInfo.defaultQuery) {
					const added = Router.addDefaultQueryToURL(
						query,
						routeInfo.defaultQuery,
					);

					if (added) return;
				}

				await routeInfo.page.render(params, query);

				break;
			}
		}
	}
}
