import { Params, Query, State, TemplateVars } from "../types";

export default abstract class View {
	static containerError(): string {
		throw `container가 존재하지 않아 UI를 진행할 수 없습니다`;
	}

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

	public get template(): string {
		return this.renderTemplate;
	}

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

	public setContainer(containerId: string): void {
		this.container = document.getElementById(containerId);
	}

	private resetTemplate = (): void => {
		this.renderTemplate = this.originalTemplate;
	};

	public setTemplateVars = (vars: TemplateVars): string => {
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

		this.renderTemplate = this.renderTemplate.replaceAll(varPattern, "");
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

	public appendToContainer = (
		containerId?: string | null,
		options?: {
			async?: boolean;
			clearTemplateVars?: boolean;
		},
	): void | Promise<void> => {
		if (!containerId && !this.container) {
			throw View.containerError();
		}

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

		this.resetTemplate();

		if (options?.async) {
			return new Promise((resolve) => {
				setTimeout(() => {
					resolve();
				}, 0);
			});
		}
	};

	public addEvent({
		selector,
		eventName,
		handler,
	}: {
		selector?: string;
		eventName: string;
		handler: (e: Event, ...args: any[]) => void;
	}): void {
		if (selector) {
			const els = selector?.split(" ");

			if (els.length > 1) {
				const [ancestorSelector, childSelector] = els;
				const ancestorEl = document.querySelector(ancestorSelector);

				ancestorEl?.addEventListener(eventName, (e) => {
					const target = e.target as HTMLElement;
					const childCollection = document.querySelectorAll(childSelector);

					const childEl = Array.from(childCollection).find((child) => {
						if (target === child) return true;
						if (target.closest(".page") === child) return true;

						return false;
					});

					handler(e, childEl);
				});

				return;
			}

			const el = document.querySelector(selector);

			el?.addEventListener(eventName, (e) => handler(e));
		} else {
			document.addEventListener(eventName, handler);
		}
	}

	public render(args?: {
		containerId?: string;
		params?: Params | null;
		query?: Query | null;
		options?: { async?: boolean; clearTemplateVars?: boolean };
	}): void | Promise<void> {
		const { containerId, params, query, options } = args ?? {};

		if (!containerId && !this.container) {
			View.containerError();
			return;
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

		const container = containerId
			? document.getElementById(containerId)
			: this.container;

		if (container) {
			container.innerHTML = this.renderTemplate;
		}

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
