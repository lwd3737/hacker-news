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
	static getPageFromHash(): number {
		return Number(window.location.hash.split("?page=")[1]);
	}

	private store: Store;
	private pageView: Page;

	constructor(containerId: string | undefined, store: Store) {
		super(PAGINATION_TEMPLATE, containerId);

		this.store = store;
		this.pageView = new Page();

		this.addEvent({
			selector: "#root .page",
			eventName: "click",
			handler: (e, target: HTMLElement) => this.onPageClick(e, target),
		});
	}
	public paginate(page: number): void {
		this.store.currentPage = page;
		location.hash = location.hash.replace(/page=(\d+)/, `page=${page}`);
	}

	public onPageClick(e: Event, target: HTMLElement): void {
		console.log("t: ", target);
		const page = Number(target.dataset.page);

		if (page) {
			this.paginate(page);
			//this.pageView.changePage(page);
		}
	}

	public async render({
		containerId,
	}: {
		containerId?: string;
	}): Promise<void> {
		await this.appendToContainer(containerId, { async: true });

		for (let page = 1; page <= this.store.totalPage; page++) {
			const t = this.pageView.setTemplateVars({ page });

			if (page === this.store.currentPage) {
				this.pageView.setTemplateVars({
					current_page: "current-page",
				});
			}

			this.pageView.appendToContainer("pagination", {
				clearTemplateVars: true,
			});
		}
	}
}

class Page extends View {
	constructor(containerId?: string) {
		super(PAGE_TEMPLATE, containerId);
	}

	public changePage(page: number): void {
		console.log("p: ", page);
		const pageCollection = document.getElementsByClassName("page");
		const currentPageEl = Array.from(pageCollection).find((page) => {
			return page.classList.contains("current-page");
		}) as HTMLElement;

		if (!currentPageEl) return;

		const currentPage = Number(currentPageEl.dataset?.page);
		if (currentPage === page) return;

		currentPageEl.classList.remove("current-page");

		const pageElToChange = Array.from(pageCollection).find((pageEl) => {
			return Number((pageEl as HTMLElement).dataset.page) === page;
		});

		pageElToChange?.classList.add("current-page");
	}
}
