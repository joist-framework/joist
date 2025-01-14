import { assert } from "chai";

import { inject } from "./inject.js";
import { injectable } from "./injectable.js";
import { Injector, injectables } from "./injector.js";
import { created, injected } from "./lifecycle.js";

it("should call onInit and onInject when a service is first created", () => {
	const i = new Injector();

	@injectable()
	class MyService {
		res = {
			onCreated: 0,
			onInjected: 0,
		};

		@created()
		onCreated() {
			this.res.onCreated++;
		}

		@injected()
		onInjected() {
			this.res.onInjected++;
		}
	}

	const service = i.inject(MyService);

	assert.deepEqual(service.res, {
		onCreated: 1,
		onInjected: 1,
	});
});

it("should pass the injector to all lifecycle callbacks", () => {
	const i = new Injector();

	@injectable({
		name: "MyService",
	})
	class MyService {
		res: Injector[] = [];

		@created()
		onCreated(i: Injector) {
			this.res.push(i);
		}

		@injected()
		onInjected(i: Injector) {
			this.res.push(i);
		}
	}

	const service = i.inject(MyService);
	const injector = injectables.get(service);

	assert.equal(service.res[0], injector);
	assert.equal(service.res[0].parent, i);
	assert.equal(service.res[1], injector);
	assert.equal(service.res[1].parent, i);
});

it("should call onInject any time a service is returned", () => {
	const i = new Injector();

	@injectable()
	class MyService {
		res = {
			onCreated: 0,
			onInjected: 0,
		};

		@created()
		onCreated() {
			this.res.onCreated++;
		}

		@injected()
		onInjected() {
			this.res.onInjected++;
		}
	}

	i.inject(MyService);
	const service = i.inject(MyService);

	assert.deepEqual(service.res, {
		onCreated: 1,
		onInjected: 2,
	});
});

it("should call onInject and on init when injected from another service", () => {
	const i = new Injector();

	@injectable()
	class MyService {
		res = {
			onCreated: 0,
			onInjected: 0,
		};

		@created()
		onCreated() {
			this.res.onCreated++;
		}

		@injected()
		onInjected() {
			this.res.onInjected++;
		}
	}

	@injectable()
	class MyApp {
		service = inject(MyService);
	}

	i.inject(MyApp).service();
	const service = i.inject(MyService);

	assert.deepEqual(service.res, {
		onCreated: 1,
		onInjected: 2,
	});
});
