import semver, { type SemVer, rsort } from "semver";
import { request } from "undici";

export const fetchBiomeVersions = async (): Promise<string[] | undefined> => {
	try {
		const response = await request(
			"https://registry.npmjs.org/@biomejs/biome",
			{
				headers: {
					Accept: "application/json",
				},
			},
		);

		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const body = (await response.body.json()) as any;

		const unsortedVersions = Object.keys(body.versions).map((version) => {
			return semver.coerce(version);
		});

		return rsort(unsortedVersions as SemVer[]).map(
			(version) => version.version,
		);
	} catch {
		return undefined;
	}
};
