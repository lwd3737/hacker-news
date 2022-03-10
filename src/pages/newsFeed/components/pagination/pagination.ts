import { ROUTE_PATHS } from "../../../../config";
import View from "../../../../core/view";
import "./style.css";

const PAGINATION_TEMPLATE = `
  <div id="pagination">
  </div>
`;

const PAGE_TEMPLATE = `
	<span class="page {{__current_page__}}" data-page="{{__page__}}">
		{{__page__}}
	</span>
`;

export default class Pagination extends View {
	private totalPage: number;
	private currentPage: number;

	constructor(containerId: string, totalPage: number, currentPage: number) {
		super(PAGINATION_TEMPLATE, containerId);

		this.totalPage = totalPage;
		this.currentPage = currentPage;
	}

	static paginate(page: number): void {
		location.hash = location.hash.replace(/page=(\d+)/, `page=${page}`);
	}

	public render(): void {
		const pageView = new Page("pagination");

		for (let page = 1; page <= this.totalPage; page++) {
			const t = pageView.setTemplateVars({ page });

			if (page === this.currentPage) {
				pageView.setTemplateVars({
					current_page: "current-page",
				});
			}

			pageView.appendToContainer(null, { clearTemplateVars: true });
		}
	}
}

class Page extends View {
	constructor(containerId?: string) {
		super(PAGE_TEMPLATE, containerId);
	}
}
