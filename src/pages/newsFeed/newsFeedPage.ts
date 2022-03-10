import NewsFeedApi from "../../apis/newsFeedApi";
import View from "../../core/view";
import { NEWS_FEED_URL } from "../../config";
import { Layout } from "../../components/layout";
import NewsFeedCard from "./components/newsFeedCard/newsFeedCard";
import "./style.css";
import { Query } from "../../types";
import Store from "../../store";
import { Pagination } from "./components/pagination";

const NEWS_FEED_TEMPLATE = `
	<div id="news-feeds">
	</div>
`;

export default class NewsFeedPage extends View {
	private api: NewsFeedApi;
	private store: Store;

	constructor(containerId: string, store: Store) {
		const layout = new Layout(containerId);
		const template = layout.setTemplateVars({
			main: NEWS_FEED_TEMPLATE,
		});

		super(template, containerId);

		this.api = new NewsFeedApi(NEWS_FEED_URL);
		this.store = store;
	}

	public async render(_, query: Query): Promise<void> {
		if (query?.page) {
			this.store.currentPage = Number(query.page);
		}

		await super.render(null, null, { async: true });

		if (!this.store.hasFeeds) {
			this.store.setFeeds(await this.api.getData());
		}
		const feeds = this.store.getFeedsOfCurrentPage();
		const newsFeedCardView = new NewsFeedCard("news-feeds");
		const paginationView = new Pagination(
			"main",
			this.store.totalPage,
			this.store.currentPage,
		);

		feeds.forEach((feed) => {
			const { id, title, user, time_ago, comments_count, points } = feed;

			newsFeedCardView.setTemplateVars({
				id,
				title,
				user,
				time_ago,
				comments_count,
				points,
			});

			newsFeedCardView.appendToContainer(null, { clearTemplateVars: true });
		});

		await paginationView.appendToContainer(null, { async: true });

		paginationView.render();
		paginationView.addEvent("#pagination .page", "click", function (e) {
			const targetEl = this as HTMLElement;
			const page = Number(targetEl.dataset.page);

			if (typeof page === "number") {
				Pagination.paginate(page);
			}
		});
	}
}
