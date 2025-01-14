import { Injector } from "@joist/di";
import { assert } from "chai";

import { HTTP, HnService } from "./hn.service.js";
import { HttpService } from "./http.service.js";

it("should run", async () => {
	const testbed = new Injector({
		providers: [
			[
				HTTP,
				{
					use: class extends HttpService {
						id = 0;

						async fetch(input: URL, _init?: RequestInit): Promise<Response> {
							const url = new URL(input);

							if (url.pathname === "/v0/beststories.json") {
								return Response.json([0, 1, 2, 3, 4]);
							}

							if (url.pathname.startsWith("/v0/item/")) {
								this.id++;

								return Response.json({
									by: "A_D_E_P_T",
									descendants: 191,
									id: this.id,
									kids: [],
									score: 942,
									time: 1723209543,
									title: "Jake Seliger has died",
									type: "story",
									url: "https://marginalrevolution.com/marginalrevolution/2024/08/jake-seliger-is-dead.html",
								});
							}

							return Response.error();
						}
					},
				},
			],
		],
	});

	const hn = testbed.inject(HnService);

	const res = await hn.getTopStories();

	assert.deepStrictEqual(
		res.map((item) => item.id),
		[1, 2, 3, 4, 5],
	);
});
