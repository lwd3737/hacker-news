import View from "../../core/view";

export default class User extends View {
	constructor(containerId?: string) {
		const template = `
      <div class="user">
        <i class="fas fa-user mr-1"></i> 
        {{__user__}}
      </div>
    `;

		super(template, containerId);
	}
}
