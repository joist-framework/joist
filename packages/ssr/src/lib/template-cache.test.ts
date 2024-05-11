import test from "ava";

import { NoopTemplateCache, TemplateCache } from "./template-cache.js";

test("should cache (in memory)", async (t) => {
  const cache = new TemplateCache();

  await cache.set("foo-bar", "<h1>Hello World</h1>");

  t.is(await cache.get("foo-bar"), "<h1>Hello World</h1>");
});

test("should never cache (noop)", async (t) => {
  const cache = new NoopTemplateCache();

  await cache.set("foo-bar", "<h1>Hello World</h1>");

  t.is(await cache.get("foo-bar"), undefined);
});
