import { describe, expect, it } from "bun:test";
import { getAllVersions } from "../../src";

describe("versions", () => {
	it("does not return pre-release versions when specified", async () => {
		const versions = await getAllVersions(false);

		expect(versions).not.toContain("1.8.4-nightly.a579bf7");
	});

	it("returns pre-release versions when specified", async () => {
		const versions = await getAllVersions(true);

		expect(versions).toContain("1.8.4-nightly.a579bf7");
	});
});
