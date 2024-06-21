import { TYPE } from "../constant";
import browser from "webextension-polyfill/dist/browser-polyfill.min";

const reload = () => {
	window.location.reload();
};

browser.runtime.onMessage.addListener((request) => {
	if (request.type === TYPE) {
		setTimeout(() => {
			reload();
		}, 2000);
	}
	return true;
});
