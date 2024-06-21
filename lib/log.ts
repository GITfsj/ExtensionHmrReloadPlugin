function log() {
	const prefix = "[ExtensionHmrReloadPlugin] ";

	const error = (msg: string) => {
		console.error(prefix + msg);
	};

	const success = (msg: string) => {
		console.log(`\x1b[32m${prefix}${msg}\x1b[0m`);
	};

	const info = (msg: string) => {
		console.log(`\x1b[34m${prefix}${msg}\x1b[0m`);
	};

	return {
		error,
		info,
		success,
	};
}

export default log();
