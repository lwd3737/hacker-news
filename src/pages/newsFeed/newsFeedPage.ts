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
	private paginationView: Pagination;
	private newsFeedCardView: NewsFeedCard;

	constructor(containerId: string, store: Store) {
		const layout = new Layout(containerId);
		const template = layout.setTemplateVars({
			main: NEWS_FEED_TEMPLATE,
		});

		super(template, containerId);
		super.render();

		this.api = new NewsFeedApi(NEWS_FEED_URL);
		this.store = store;
		this.paginationView = new Pagination("main", store);
		this.newsFeedCardView = new NewsFeedCard("news-feeds");
	}

	public async render(query: Query): Promise<void> {
		if (query?.page) {
			this.store.currentPage = Number(query.page);
		}

		if (!this.store.hasFeeds) {
			this.store.setFeeds(await this.api.getData());
		}

		const feeds = this.store.getFeedsOfCurrentPage();

		feeds.forEach((feed) => {
			const { id, title, user, time_ago, comments_count, points } = feed;

			this.newsFeedCardView.setTemplateVars({
				id,
				title,
				user,
				time_ago,
				comments_count,
				points,
			});

			console.log("card: ", this.newsFeedCardView);

			this.newsFeedCardView.appendToContainer(null, {
				clearTemplateVars: true,
			});
		});

		await this.paginationView.appendToContainer(null, { async: true });

		this.paginationView.render();
		this.paginationView.addEvent({
			selector: "#pagination .page",
			eventName: "click",
			handler: function (e, target) {
				const targetEl = target as HTMLElement;
				const page = Number(targetEl.dataset.page);

				if (typeof page === "number") {
					Pagination.paginate(page);
				}
			},
		});
	}
}
