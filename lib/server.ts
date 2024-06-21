const chokidar = require("chokidar");
const fs = require("fs");

import { ACTION } from "./constant";
import log from "./log";

export const initServer = (options: {
	listenDir: string;
	reloadDir: Array<string>;
	callback: Function;
}) => {
	const { listenDir, reloadDir, callback } = options;
	if (!fs.existsSync(listenDir)) {
		log.error(`${listenDir} not exists`);
		throw new Error(`[HMR] ${listenDir} not exists`);
	}

	log.info(`start listening ${listenDir}...`);

	// check is need to reload
	const watcher = chokidar.watch(listenDir, {
		persistent: true,
	});

	watcher.on("change", async (filePath: string) => {
		if (reloadDir.some((root) => filePath.includes(root))) {
			callback(ACTION.RELOAD);
		} else {
			callback(ACTION.REFRESH);
		}
	});

	watcher.on("ready", () => {
		log.success("Initial scan complete. Ready for changes");
	});
};
