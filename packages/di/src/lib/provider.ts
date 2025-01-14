import type { Injector } from "./injector.js";

export type ProviderFactory<T> = (injector: Injector) => T;

export class StaticToken<T> {
	#name: string;
	#factory?: ProviderFactory<T>;

	[Symbol.metadata] = {};

	get name(): string {
		return this.#name;
	}

	get factory(): ProviderFactory<T> | undefined {
		return this.#factory;
	}

	constructor(name: string, factory?: ProviderFactory<T>) {
		this.#name = name;
		this.#factory = factory;
	}
}

export interface ConstructableToken<T> {
	new (...args: any[]): T;
}

export type InjectionToken<T> = ConstructableToken<T> | StaticToken<T>;

export type ProviderDef<T> =
	| {
			use: ConstructableToken<T>;
	  }
	| {
			factory: ProviderFactory<T>;
	  };

export type Provider<T> = [InjectionToken<T>, ProviderDef<T>];
