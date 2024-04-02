const packageJsonContents = await Bun.file("package.json").text();

const patchedContents = packageJsonContents.replace(
	/"version": ".*"/,
	`"version": "${process.argv[2]}"`,
);

Bun.write("package.json", patchedContents);
