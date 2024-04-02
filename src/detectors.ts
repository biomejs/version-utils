import { readFile as nodeReadFile } from "node:fs/promises";
import semver from "semver";
import yaml from "yaml";
import { fetchBiomeVersions } from "./versions";

/**
 * Detects the version of Biome from the dependencies of the project.
 *
 * This function will attempt to detect the version of Biome from the
 * dependencies of the project specified by the working directory. If the
 * version of Biome cannot be detected, this function will return the specified
 * fallback version, or undefined
 */
export const detectFromDependencies = async (workingDir: string) => {
	return (
		(await detectFromNpmLockfile(`${workingDir}/package-lock.json`, false)) ??
		(await detectFromPnpmLockfile(`${workingDir}/pnpm-lock.yaml`, false)) ??
		(await detectFromYarnLockfile(`${workingDir}/yarn.lock`, false)) ??
		(await detectFromPackageJson(`${workingDir}/package.json`, false))
	);
};

/**
 * Detects the version of Biome from an npm lockfile.
 *
 * This function will attempt to detect the version of Biome from the npm lockfile
 * specified by the path. If the version of Biome cannot be detected, this function
 * will return undefined.
 *
 * @param packageLockJsonPath The path to the package-lock.json file
 */
export const detectFromNpmLockfile = async (
	packageLockJsonPath: string,
	shouldThrow = true,
) => {
	const lockfileContents = await readFile(packageLockJsonPath, shouldThrow);

	if (!lockfileContents) {
		return undefined;
	}

	try {
		const lockfile = JSON.parse(lockfileContents);
		return lockfile.packages?.["node_modules/@biomejs/biome"]?.version;
	} catch {
		return undefined;
	}
};

/**
 * Detects the version of Biome from a pnpm lockfile.
 *
 * This function will attempt to detect the version of Biome from the pnpm lockfile
 * specified by the path. If the version of Biome cannot be detected, this function
 * will return undefined.
 *
 * @param pnpmLockYamlPath The path to the pnpm-lock.yaml file
 */
export const detectFromPnpmLockfile = async (
	pnpmLockYamlPath: string,
	shouldThrow = true,
) => {
	const lockfileContents = await readFile(pnpmLockYamlPath, shouldThrow);

	if (!lockfileContents) {
		return undefined;
	}

	try {
		const lockfile = yaml.parse(lockfileContents);
		return (
			lockfile.devDependencies?.["@biomejs/biome"]?.version ??
			lockfile.dependencies?.["@biomejs/biome"]?.version
		);
	} catch {
		return undefined;
	}
};

/**
 * Detects the version of Biome from a yarn lockfile.
 *
 * This function will attempt to detect the version of Biome from the yarn lockfile
 * specified by the path. If the version of Biome cannot be detected, this function
 * will return undefined.
 *
 * @param yarnLockPath The path to the yarn.lock file
 */
export const detectFromYarnLockfile = async (
	yarnLockPath: string,
	shouldThrow = true,
) => {
	const lockfileContents = await readFile(yarnLockPath, shouldThrow);

	if (!lockfileContents) {
		return undefined;
	}

	try {
		const lockfile = yaml.parse(lockfileContents);
		const biome = Object.keys(lockfile).filter((name) =>
			name.startsWith("@biomejs/biome@"),
		)?.[0];
		return lockfile[biome]?.version;
	} catch {
		return undefined;
	}
};

/**
 * Detects the version of Biome from the package.json file.
 *
 * This function will attempt to detect the version of Biome from the package.json
 * file specified by the path. If the version of Biome cannot be detected, this
 * function will return undefined.
 *
 * If the version of Biome is specified as a range, this function will attempt
 * fetch the list of Biome versions from the npm registry a return the latest
 * version that satisfies the range.
 *
 * @param packageJsonPath The path to the package.json file
 */
export const detectFromPackageJson = async (
	packageJsonPath: string,
	shouldThrow = true,
) => {
	const packageJsonContents = await readFile(packageJsonPath, shouldThrow);

	if (!packageJsonContents) {
		return undefined;
	}

	try {
		const packageJson = JSON.parse(packageJsonContents);

		const versionSpecifier =
			packageJson.devDependencies?.["@biomejs/biome"] ??
			packageJson.dependencies?.["@biomejs/biome"];

		// Biome is not a dependency of the project
		if (!versionSpecifier) {
			return undefined;
		}

		// We check if the versioon specifier is a valid version. If so, it
		// means that the version specifier is a fixed version and we can
		// return it directly.
		if (semver.valid(versionSpecifier)) {
			return versionSpecifier;
		}

		// If the version specifier is a range, we fetch the list of Biome
		// versions from the npm registry and return the latest version that
		// satisfies the range.
		if (semver.validRange(versionSpecifier)) {
			const versions = await fetchBiomeVersions();

			// If we are unable to fetch the list of Biome versions, we return
			// undefined.
			if (!versions) {
				return undefined;
			}

			return semver.maxSatisfying(versions, versionSpecifier);
		}
	} catch {
		return undefined;
	}
};

/**
 * Reads the contents of a lockfile.
 *
 * This function will attempt to read the contents of the lockfile specified by the
 * path. If the lockfile cannot be read, this function will throw an error.
 *
 * @param lockfilePath The path to the lockfile
 *
 * @throws {Error} If the lockfile cannot be read
 */
const readFile = async (
	lockfilePath: string,
	shouldThrow = true,
): Promise<string | undefined> => {
	try {
		return await nodeReadFile(lockfilePath, "utf8");
	} catch (error) {
		if (shouldThrow) {
			throw new Error(`Unable to read lockfile at path ${lockfilePath}`);
		}
		return undefined;
	}
};
