import { ROUTE_PATHS } from "../../../../config";
import View from "../../../../core/view";
import Store from "../../../../store";
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
	private store: Store;
	private pageView: Page;

	constructor(containerId: string, store: Store) {
		super(PAGINATION_TEMPLATE, containerId);

		this.store = store;
		this.pageView = new Page("pagination");

		this.addEvent({ eventName: "hashchange", handler: this.render });
	}

	static paginate(page: number): void {
		location.hash = location.hash.replace(/page=(\d+)/, `page=${page}`);
	}

	public render(): void {
		for (let page = 1; page <= this.store.totalPage; page++) {
			const t = this.pageView.setTemplateVars({ page });

			if (page === this.store.currentPage) {
				this.pageView.setTemplateVars({
					current_page: "current-page",
				});
			}

			this.pageView.appendToContainer(null, { clearTemplateVars: true });
		}
	}
}

class Page extends View {
	constructor(containerId?: string) {
		super(PAGE_TEMPLATE, containerId);
	}
}
