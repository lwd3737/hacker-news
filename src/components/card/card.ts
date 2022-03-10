import View from "../../core/view";
import "./style.css";

const TEMPLATE = `
  <div class="card">
    <div class="head">
      {{__head__}}
    </div>

    <a class="title" href="#/news-feeds/{{__id__}}/">
      {{__title__}}
    </a>

    <div class="body">
      {{__body__}}
    </div>

    <div class="bottom">
      {{__bottom__}}
    </div>
  </div>
`;

export default class Card extends View {
	constructor(containerId?: string) {
		super(TEMPLATE, containerId);
	}
}
