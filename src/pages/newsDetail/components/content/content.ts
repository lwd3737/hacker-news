import View from "../../../../core/view";
import "./style.css";

const TEMPLATE = `
	<div class="content">
		{{__content__}}
	</div>
`;

export default class Content extends View {
	constructor(containerId?: string) {
		super(TEMPLATE, containerId);
	}
}
