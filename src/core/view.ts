import { Params, Query, State } from "../types";

export default abstract class View {
	static CONTAINER_ERROR = "container가 존재하지 않아 UI를 진행할 수 없습니다";

	private container: HTMLElement | null;
	private originalTemplate: string;
	private renderTemplate: string;
	private _state: State | null;

	constructor(template: string, containerId?: string) {
		this.originalTemplate = template;
		this.renderTemplate = template;
		this._state = null;

		this.container = null;

		if (containerId) {
			this.setContainer(containerId);
		}
	}

	private resetTemplate = (): void => {
		this.renderTemplate = this.originalTemplate;
	};

	public get template(): string {
		return this.renderTemplate;
	}

	public setContainer(containerId: string): void {
		this.container = document.getElementById(containerId);
	}

	public setTemplateVars = (vars: { [key: string]: any }): string => {
		for (const key in vars) {
			this.renderTemplate = this.renderTemplate.replaceAll(
				`{{__${key}__}}`,
				vars[key],
			);
		}

		return this.template;
	};

	public clearTemplateVars = (): void => {
		const varPattern = /{{__(\w+)__}}/g;

		this.renderTemplate = this.renderTemplate.replace(varPattern, "");
	};

	public mergeTemplates = (views: { [key: string]: View }): string => {
		for (const key in views) {
			if (!views[key]) continue;

			const template = views[key].template;

			this.setTemplateVars({
				[key]: template,
			});
		}

		return this.template;
	};

	public get state(): State | null {
		return this._state;
	}

	public set state(state: State | null) {
		if (state) {
			this._state = { ...this._state, ...state };
		} else {
			this._state = null;
		}
	}

	public appendToContainer = (
		containerId?: string | null,
		options?: {
			async?: boolean;
			clearTemplateVars?: boolean;
		},
	): void | Promise<void> => {
		const fragment = document.createElement("div");

		if (options?.clearTemplateVars) {
			this.clearTemplateVars();
		}

		fragment.innerHTML = this.renderTemplate;

		if (containerId) {
			this.setContainer(containerId);
			this.container!.appendChild(fragment.firstElementChild!);
		} else if (this.container) {
			this.container.appendChild(fragment.firstElementChild!);
		}

		if (!this.container) {
			throw View.CONTAINER_ERROR;
		}

		this.resetTemplate();

		if (options?.async) {
			return new Promise((resolve) => {
				setTimeout(() => {
					resolve();
				}, 0);
			});
		}
	};

	public addEvent(
		selector: string,
		eventName: string,
		handler: (e: Event) => void,
	): void {
		const els = selector.split(" ");

		if (els.length > 1) {
			const [ancestorSelector, childSelector] = els;
			const ancestorEl = document.querySelector(ancestorSelector);

			ancestorEl?.addEventListener(eventName, (e) => {
				const target = e.target as HTMLElement;
				const collection = document.querySelectorAll(childSelector);

				const targetEl = Array.from(collection).find((child) => {
					if (target === child) return true;
					if (target.closest(".page") === child) return true;

					return false;
				});

				handler.call(targetEl, e);
			});

			return;
		}

		const el = document.querySelector(selector);

		el?.addEventListener(eventName, (e) => handler(e));
	}

	public render(
		params?: Params | null,
		query?: Query | null,
		options?: { async?: boolean; clearTemplateVars?: boolean },
	): void | Promise<void> {
		if (!this.container) {
			throw View.CONTAINER_ERROR;
		}

		if (params) {
			this.setTemplateVars(params);
		}

		if (query) {
			this.setTemplateVars(query);
		}

		const { async, clearTemplateVars } = options ?? {};

		if (clearTemplateVars === undefined || clearTemplateVars === true) {
			this.clearTemplateVars();
		}

		this.container.innerHTML = this.renderTemplate;
		this.resetTemplate();

		if (async) {
			return new Promise((resolve) => {
				setTimeout(() => {
					resolve();
				}, 0);
			});
		}
	}
}
