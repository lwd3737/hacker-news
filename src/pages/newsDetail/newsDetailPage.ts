import NewsDetailApi from "../../apis/newsDetailApi";
import { CommentsCount, Like, TimeAgo, User } from "../../components";
import { Layout } from "../../components/layout";
import { NEWS_DETAIL_URL } from "../../config";
import View from "../../core/view";
import Store from "../../store";
import { Params } from "../../types";
import Comments from "./components/comments/comments";
import Content from "./components/content/content";
import "./style.css";

const NEWS_DETAIL_TEMPLATE = `
  <div class="news-detail">
    <div class="head">
      {{__user__}}
      {{__time_ago__}}
    </div>
    <h1 class="title">
      {{__title__}}
    </h1>
    <div class="content">
      {{__content__}}
    </div>
    <div class="bottom">
      {{__like__}}
      {{__comments_count__}}
    </div>
		
		{{__comments__}}
  </div>
`;
const HEADER_RIGHT_TEMPLATE = `
  <a class="close-btn" href="#/news-feeds/?page={{__current_page__}}">
    <i class="fa fa-times"></i>
  </a>
`;

export default class NewsDetailPage extends View {
	private store: Store;
	private views: { [key: string]: View };

	constructor(containerId: string, store: Store) {
		const layout = new Layout(containerId);
		const template = layout.setTemplateVars({
			main: NEWS_DETAIL_TEMPLATE,
			header_right: HEADER_RIGHT_TEMPLATE,
		});

		super(template, containerId);

		this.store = store;

		this.views = {
			like: new Like(),
			user: new User(),
			timeAgo: new TimeAgo(),
			commentsCount: new CommentsCount(),
			content: new Content(),
			comments: new Comments(),
		};
	}

	public async render(params: Params): Promise<void> {
		if (!("id" in params)) {
			throw "id not exist";
		}

		const id = params.id as string;
		const url = NEWS_DETAIL_URL.replace("@id", id);
		const api = new NewsDetailApi(url);

		const views = this.views;
		const { title, points, user, time_ago, content, comments, comments_count } =
			await api.getData();

		this.mergeTemplates({
			user: views.user,
			time_ago: views.timeAgo,
			content: views.content,
			like: views.like,
			comments_count: views.commentsCount,
			comments: views.comments,
		});

		this.setTemplateVars({
			title,
			user,
			points,
			time_ago,
			content: content.length === 0 ? "내용이 없습니다" : content,
			comments_count,
			current_page: this.store.currentPage,
		});

		views.comments.state = {
			comments,
		};

		await super.render(null, null, { async: true, clearTemplateVars: false });

		views.comments.setContainer("comments");
		views.comments.render();
	}
}
