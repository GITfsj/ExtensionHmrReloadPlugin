import { TYPE } from "../constant";
import browser from "webextension-polyfill/dist/browser-polyfill.min";
import { ACTION } from "../constant";
let ws: WebSocket;
function connect(options?: { reconnect?: boolean }) {
	// @ts-ignore
	// eslint-disable-next-line no-undef
	ws = new WebSocket(LOCAL_RELOAD_SOCKET_URL);
	ws.onopen = function () {
		if (options?.reconnect) {
			setTimeout(() => {
				browser.runtime.reload();
			}, 100);
		} else {
			console.log("connected to reload server");
		}
	};
	ws.onerror = function (e) {
		console.error("reload server error", e);
	};
	// 重连
	ws.onclose = function () {
		setTimeout(() => {
			console.log("reconnect to reload server");
			connect({ reconnect: true });
		}, 5000);
	};
	ws.onmessage = async function (e: MessageEvent) {
		const data = JSON.parse(e.data);
		const msg = data?.msg;
		if (msg === ACTION.RELOAD) {
			const tabs = await browser.tabs.query({
				active: true,
				currentWindow: true,
			});
			if (!tabs || tabs.length === 0) return;
			browser.tabs.sendMessage(tabs[0].id, { type: TYPE });
			setTimeout(() => {
				browser.runtime.reload();
			}, 500);
		}
	};
}
connect();
