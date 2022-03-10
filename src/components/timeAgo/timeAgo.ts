import View from "../../core/view";
import "./style.css";

const TEMPLATE = `
  <div class="time-ago">
    <i class="far fa-clock mr-1"></i>
    {{__time_ago__}}
  </div>
`;

export default class TimeAgo extends View {
	constructor(containerId?: string) {
		super(TEMPLATE, containerId);
	}
}
