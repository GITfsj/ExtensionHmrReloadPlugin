const fs = require("fs");
import { WebSocketServer } from "ws";
import { initServer } from "./server";
import { resolve } from "path";
import {
	LOCAL_RELOAD_SOCKET_PORT,
	ACTION,
	RELOAD_ROOT_PATH,
	LISTEN_DIR,
} from "./constant";
import log from "./log";

const injectionsPath = resolve(__dirname, "..", "build", "injections");

const defaultOptions = {
	injections: {
		reload: ["background"],
		refresh: ["content"],
	},
	listenDir: resolve(LISTEN_DIR),
	reloadDir: RELOAD_ROOT_PATH,
	port: LOCAL_RELOAD_SOCKET_PORT,
};

const fillOptions = (options: Options): Options => {
	const _options: Options = {
		...defaultOptions,
		...options,
	};
	_options.injections.reload = {
		injectFile: resolve(injectionsPath, "background.js"),
		entryNames: ["background.js"],
	};
	_options.injections.refresh = {
		injectFile: resolve(injectionsPath, "content.js"),
		entryNames: ["content.js"],
	};
	return _options;
};

const loader = (port: Options["port"], option: InjectOptions) => {
	const LOCAL_RELOAD_SOCKET_URL = `ws://localhost:${port}`;
	const { injectFile } = option;
	if (injectFile) {
		return `
    const LOCAL_RELOAD_SOCKET_URL = "${LOCAL_RELOAD_SOCKET_URL}";\n${fs.readFileSync(
			injectFile,
			"utf-8"
		)}`;
	}
	throw new Error("injectFile is required");
};

type InjectOptions = {
	injectFile: string;
	entryNames: string[];
};

type Options = {
	injections: {
		reload: InjectOptions;
		refresh: InjectOptions;
	};
	listenDir: string;
	reloadDir: string[];
	port: number;
};

export class HmrReloadPlugin {
	ws: WebSocketServer = null;
	reloadSignals: Array<boolean> = []; // adapte webpack hmr queue
	options: Options;
	constructor(options: Options) {
		this.options = fillOptions(options);
		const { listenDir, reloadDir } = this.options;
		this.initializeWebSocket();
		initServer({
			listenDir,
			reloadDir,
			callback: this.listenCallback.bind(this),
		});
	}

	listenCallback(action: ACTION) {
		if (action === ACTION.RELOAD) {
			this.reloadSignals.push(true);
		}
	}

	initializeWebSocket() {
		if (!this.ws) {
			this.ws = new WebSocketServer({ port: this.options.port });
			this.ws.on("connection", () => {
				log.success(`Connecting to dev-server at ${this.options.port}`);
			});
			this.ws.on("error", () => {
				log.error(
					`Failed to start server at ${LOCAL_RELOAD_SOCKET_PORT}`
				);
				this.ws = null;
				setTimeout(() => this.initializeWebSocket(), 5000);
			});
		}
	}

	apply(compiler) {
		// 编译完成提交完成阶段
		compiler.hooks.done.tap("HmrReloadPlugin", () => {
			if (this.reloadSignals.length > 0) {
				this.reloadSignals.pop();
				this.ws.clients.forEach((client) => {
					client.send(JSON.stringify({ msg: ACTION.RELOAD }));
				});
			}
		});

		compiler.hooks.thisCompilation.tap("HmrReloadPlugin", (compilation) => {
			compilation.hooks.processAssets.tap(
				{
					name: "HmrReloadPlugin",
					stage: compilation.PROCESS_ASSETS_STAGE_SUMMARIZE,
				},
				(assets) => {
					compilation.chunks.forEach((chunk) => {
						chunk.files.forEach((file: string) => {
							Object.entries(this.options.injections).forEach(
								([_, val]) => {
									console.log(val.entryNames, file);
									if (
										val.entryNames.some((entry) =>
											file.includes(entry)
										)
									) {
										const assetSource =
											assets[file].source();
										const injectedSource = `${assetSource};\n${loader(
											this.options.port,
											val
										)}`;
										assets[file] = {
											source: () => injectedSource,
											size: () => injectedSource.length,
										};
									}
								}
							);
						});
					});
				}
			);
		});
	}
}
