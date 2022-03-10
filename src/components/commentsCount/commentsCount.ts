import View from "../../core/view";

const TEMPLATE = `
  <div class="comments_count">
    <i class="far fa-comment-dots"></i>
    {{__comments_count__}}
  </div>
`;

export default class CommentsCount extends View {
	constructor(containerId?: string) {
		super(TEMPLATE, containerId);
	}
}
