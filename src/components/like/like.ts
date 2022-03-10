import View from "../../core/view";
import "./style.css";

export default class Like extends View {
	constructor(containerId?: string) {
		const template = `
      <div class="like">
        <i class="fas fa-heart mr-1"></i>
        {{__points__}}
      </div>
    `;

		super(template, containerId);
	}
}
