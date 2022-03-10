import View from "../../core/view";
import "./style.css";

export default class Layout extends View {
	constructor(containerId?: string) {
		const template = `<div class="app-container">
				<header>
					<h3 class="logo">Hacker News</h3>
					<div class="right">
						{{__header_right__}}
          </div>
				</header>
				<main id="main">
					{{__main__}}
				</main>
			</div>`;

		super(template, containerId);
	}
}
