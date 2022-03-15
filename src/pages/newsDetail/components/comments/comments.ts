import { TimeAgo, User } from "../../../../components";
import View from "../../../../core/view";
import { NewsComment, State } from "../../../../types";
import "./style.css";

const COMMNETS_TEMPLATE = `
	<div id="comments">
	</div>
`;

const COMMENT_TEMPLATE = `
	<div id="{{__id__}}" class="comment" {{__style__}} >
		<div class="info">
			{{__user__}}
			{{__time_ago__}}
		</div>

		<div class="content">
			{{__content__}}
		</div>
	</div>
`;

export default class Comments extends View {
	private views: { [key: string]: View };

	constructor(containerId?: string) {
		super(COMMNETS_TEMPLATE, containerId);

		this.views = {
			comment: new Comment("comments"),
			user: new User(),
			timeAgo: new TimeAgo(),
		};
	}

	public async renderNestedComments(
		parentId: string,
		comments: NewsComment[],
	): Promise<void> {
		comments.forEach(async (comment: NewsComment) => {
			const { id, user, content, time_ago, level, comments, comments_count } =
				comment;

			this.views.comment.mergeTemplates({
				user: this.views.user,
				time_ago: this.views.timeAgo,
			});

			this.views.comment.setTemplateVars({
				id,
				user,
				time_ago,
				content,
			});

			this.views.comment.state = {
				level,
			};

			await this.views.comment.appendToContainer(parentId, {
				async: true,
			});

			if (comments_count > 0) {
				await this.renderNestedComments(id.toString(), comments);
			}
		});
	}

	public async render(): Promise<void> {
		await super.render({ options: { async: true } });

		const comments = this.state?.comments as NewsComment[];

		if (!comments) return;

		this.renderNestedComments("comments", comments);
	}
}

class Comment extends View {
	constructor(containerId?: string) {
		super(COMMENT_TEMPLATE, containerId);
	}

	public set state(state: State) {
		const level = state?.level as number;

		if (level) {
			this.setTemplateVars({
				style: `style="padding-left: ${20 * level}px;"`,
			});
		}
	}
}
