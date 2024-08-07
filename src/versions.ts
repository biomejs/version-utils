import semver, { type SemVer, rsort } from "semver";
import { request } from "undici";

/**
 * Retrieves the latest version of Biome from the npm registry.
 */
export const getLatestVersion = async (
	channel: "stable" | "nightly" = "stable",
): Promise<string | undefined> => {
	try {
		const versions = await getAllVersions(channel === "nightly");
		return versions?.[0];
	} catch {
		return undefined;
	}
};

/**
 * Fetches the list of Biome versions from the npm registry.
 */
export const getAllVersions = async (
	includePrereleases = true,
): Promise<string[] | undefined> => {
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
			return semver.coerce(version, { includePrerelease: true });
		});

		const filteredVersions = unsortedVersions.filter((version) => {
			if (!includePrereleases) {
				return version?.prerelease.length === 0;
			}

			return true;
		});

		return rsort(filteredVersions as SemVer[]).map(
			(version) => version.version,
		);
	} catch {
		return undefined;
	}
};
