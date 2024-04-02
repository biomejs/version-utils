import semver, { type SemVer, rsort } from "semver";
import { request } from "undici";

/**
 * Retrieves the latest version of Biome from the npm registry.
 */
export const getLatestVersion = async (): Promise<string | undefined> => {
	try {
		const versions = await getAllVersions();
		return versions?.[0];
	} catch {
		return undefined;
	}
};

/**
 * Fetches the list of Biome versions from the npm registry.
 */
export const getAllVersions = async (): Promise<string[] | undefined> => {
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
