import { describe, expect, it, mock } from "bun:test";
import { join } from "node:path";
import {
	detectFromDependencies,
	detectFromNpmLockfile,
	detectFromPackageJson,
	detectFromPnpmLockfile,
	detectFromYarnLockfile,
} from "../../src";

const mocks = {
	getAllVersions: mock(),
};

mock.module("../../src/versions", () => {
	return {
		getAllVersions: mocks.getAllVersions,
	};
});

describe("detector", () => {
	it("detects the version from npm dependencies using the agnostic helper", async () => {
		const version = await detectFromDependencies(
			join(__dirname, "../fixtures/npm/dependencies"),
		);

		expect(version).toBe("1.6.3");
	});

	it("detects the version from npm devDependencies using the agnostic helper", async () => {
		const version = await detectFromDependencies(
			join(__dirname, "../fixtures/npm/devDependencies"),
		);

		expect(version).toBe("1.6.3");
	});

	it("detects the version from npm dependencies using the npm helper function", async () => {
		const version = await detectFromNpmLockfile(
			join(__dirname, "../fixtures/npm/dependencies/package-lock.json"),
		);

		expect(version).toBe("1.6.3");
	});

	it("detects the version from npm devDependencies using the npm helper function", async () => {
		const version = await detectFromNpmLockfile(
			join(__dirname, "../fixtures/npm/devDependencies/package-lock.json"),
		);

		expect(version).toBe("1.6.3");
	});

	it("detects the version from pnpm dependencies using the agnostic helper", async () => {
		const version = await detectFromDependencies(
			join(__dirname, "../fixtures/pnpm/dependencies"),
		);

		expect(version).toBe("1.6.3");
	});

	it("detects the version from pnpm devDependencies using the agnostic helper", async () => {
		const version = await detectFromDependencies(
			join(__dirname, "../fixtures/pnpm/devDependencies"),
		);

		expect(version).toBe("1.6.3");
	});

	it("detects the version from pnpm dependencies using the pnpm helper function", async () => {
		const version = await detectFromPnpmLockfile(
			join(__dirname, "../fixtures/pnpm/dependencies/pnpm-lock.yaml"),
		);

		expect(version).toBe("1.6.3");
	});

	it("detects the version from pnpm devDependencies using the pnpm helper function", async () => {
		const version = await detectFromPnpmLockfile(
			join(__dirname, "../fixtures/pnpm/devDependencies/pnpm-lock.yaml"),
		);

		expect(version).toBe("1.6.3");
	});

	it("detects the version from yarn dependencies using the agnostic helper", async () => {
		const version = await detectFromDependencies(
			join(__dirname, "../fixtures/yarn/dependencies"),
		);

		expect(version).toBe("1.6.3");
	});

	it("detects the version from yarn devDependencies using the agnostic helper", async () => {
		const version = await detectFromDependencies(
			join(__dirname, "../fixtures/yarn/devDependencies"),
		);

		expect(version).toBe("1.6.3");
	});

	it("detects the version from yarn dependencies using the yarn helper function", async () => {
		const version = await detectFromYarnLockfile(
			join(__dirname, "../fixtures/yarn/dependencies/yarn.lock"),
		);

		expect(version).toBe("1.6.3");
	});

	it("detects the version from yarn devDependencies using the yarn helper function", async () => {
		const version = await detectFromYarnLockfile(
			join(__dirname, "../fixtures/yarn/devDependencies/yarn.lock"),
		);

		expect(version).toBe("1.6.3");
	});

	it("detects the version from package.json devDependencies using the agnostic helper", async () => {
		const version = await detectFromDependencies(
			join(__dirname, "../fixtures/bun/devDependencies"),
		);

		expect(version).toBe("1.6.3");
	});

	it("detects the version from package.json dependencies using the agnostic helper", async () => {
		const version = await detectFromDependencies(
			join(__dirname, "../fixtures/bun/dependencies"),
		);

		expect(version).toBe("1.6.3");
	});

	it("detects the version from package.json devDependencies using the package.json helper function", async () => {
		const version = await detectFromPackageJson(
			join(__dirname, "../fixtures/bun/devDependencies/package.json"),
		);

		expect(version).toBe("1.6.3");
	});

	it("detects the version from package.json dependencies using the package.json helper function", async () => {
		const version = await detectFromPackageJson(
			join(__dirname, "../fixtures/bun/dependencies/package.json"),
		);

		expect(version).toBe("1.6.3");
	});

	it("retrieves the latest version in range from the npm registry", async () => {
		// We mock the response from the NPM registry so the test is deterministic
		// even if the version of the package changes
		mocks.getAllVersions.mockResolvedValue(["1.6.4", "1.6.3", "1.6.2"]);

		const version = await detectFromPackageJson(
			join(__dirname, "../fixtures/npm/devDependencies/package.json"),
		);

		expect(version).toBe("1.6.4");
	});
});
