import { Card, CommentsCount, Like, User } from "../../../../components";
import View from "../../../../core/view";
import "./style.css";

const CARD_HEAD_TEMPLATE = `
  {{__user__}}
`;

const CARD_BOTTOM_TEMPLATE = `
	<div class="news-feeds-info">
		{{__like__}}
		{{__comments_count__}}
	</div>
`;

export default class NewsFeedCard extends View {
	constructor(containerId?: string) {
		const cardView = new Card(containerId);
		const likeView = new Like();
		const userView = new User();
		const commentsCountView = new CommentsCount();

		cardView.setTemplateVars({
			head: CARD_HEAD_TEMPLATE,
			bottom: CARD_BOTTOM_TEMPLATE,
		});

		const template = cardView.mergeTemplates({
			like: likeView,
			user: userView,
			comments_count: commentsCountView,
		});

		super(template, containerId);
	}
}
