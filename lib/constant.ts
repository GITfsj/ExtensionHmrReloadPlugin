const LOCAL_RELOAD_SOCKET_PORT = 4001;
const LOCAL_RELOAD_SOCKET_URL = `ws://localhost:${LOCAL_RELOAD_SOCKET_PORT}`;
const TYPE = "build_complete";
const LISTEN_DIR = "./";
const RELOAD_ROOT_PATH = ["background", "content"];
enum ACTION {
	RELOAD,
	REFRESH,
}

export {
	LOCAL_RELOAD_SOCKET_PORT,
	LOCAL_RELOAD_SOCKET_URL,
	TYPE,
	LISTEN_DIR,
	RELOAD_ROOT_PATH,
	ACTION,
};
