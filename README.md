# Version utils

This library provides helper functions to detect the version of Biome from the
dependencies of a given project.

> [!WARNING]
> This is an internal library, and semver is not guaranteed to be followed, so
> depend on it at your own risk.

## Installation

```sh
npm install @biomejs/version-utils
```

## Usage

### Detecting from dependencies

To detect the version of Biome from the dependencies of a given project, use
the `detectFromDependencies` helper function. This function will look for the
version of Biome in the dependencies of the lockfile for the project, and fall
back to the `package.json` file if no lockfile is found, or if it cannot be read.

```ts
import { detectFromDependencies } from '@biomejs/version-utils';

const version = detectFromDependencies('/path/to/project');
```

> [!TIP]
> The lockfiles of the following package managers are supported:
> - npm (`package-lock.json`)
> - pnpm (`pnpm-lock.yaml`)
> - yarn (`yarn.lock`)
>
> Bun's lockfile is binary and cannot be easily read, so we fall back to the
> `package.json` file for Bun projects.

## License

Copyright © 2024, Nicolas Hedger. Released under the [MIT License](./LICENSE.md).