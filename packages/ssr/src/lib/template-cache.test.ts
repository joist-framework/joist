import { assert } from "chai";

import { NoopTemplateCache, TemplateCache } from "./template-cache.js";

it("should cache (in memory)", async () => {
	const cache = new TemplateCache();

	await cache.set("foo-bar", "<h1>Hello World</h1>");

	assert.equal(await cache.get("foo-bar"), "<h1>Hello World</h1>");
});

it("should never cache (noop)", async () => {
	const cache = new NoopTemplateCache();

	await cache.set("foo-bar", "<h1>Hello World</h1>");

	assert.equal(await cache.get("foo-bar"), undefined);
});
