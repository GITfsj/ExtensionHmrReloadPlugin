## Extension-hmr-reload-plugin

[![English](https://img.shields.io/badge/lang-English-blue.svg)](README.md)   [![Chinese](https://img.shields.io/badge/lang-中文-blue.svg)](README_zh.md) 

### What is it

This is a hot module replacement (HMR) Webpack plugin for developing browser extensions (Chrome/Edge/Firefox). With the advent of AI and the updates in modern browser functionalities, AI-based browser extensions are emerging. If you are interested in browser extension development and Webpack, we hope this plugin will be helpful to you.

### Features

- Automatic reload of `background` and `content scripts` in development mode, eliminating the need for frequent manual extension reloads.
- Uses `webextension-polyfill` to ensure compatibility across different browsers.
- Friendly TypeScript type hints.

### Which environment is available

Webpack 5 and scaffolding tools based on Webpack 5.

### Why was it created

During local development of browser extensions, due to the local installation and debugging characteristics and browser restrictions, `background` and `content scripts` do not update automatically. Even if the local files have indeed been updated, developers need to manually refresh the extension files (background) and the web pages (content scripts) in the browser.
This plugin provides the capability to automatically reload the extension and refresh the relevant web pages.

### How to use

In Webpack:

```javascript
const { HmrReloadPlugin } = require("extension-hmr-reload-plugin");
module.exports = {
    ...
    plugins:[
        ...
        new HmrReloadPlugin(),
    ]
}
```

### Plugin Options

#### port

The server port for the plugin, default is `4001`.

#### injections

An array of filenames that need to be injected with the hot reload script. Check the filenames in your output directory, for example:

```shell
# your output directory
output 
	- background.js
	- background.xxx.js
	- content
		- content-script.js
	- sidepanel.js
	- ...
```

So you can specify the filenames like this, the filenames will be matched inclusively:

```typescript
new HmrReloadPlugin({
  injections:{
    reload: ['background.js'],
    refresh: ['content-script'],
  },
}),
```

#### listenDir

string

The directory to watch, default is the same level as the configuration file `./`.

### reloadDir

string[]

Directories that, when files are changed, will trigger a reload. Default is `background`. Fill this based on your project structure. Here is an example project structure:

```shell
# your project
src
	- background
		- ...
webpack.config.js
```

Example configuration:

```typescript
// plugin options
new HmrReloadPlugin({
  injections:{
    reload: ['background.js'],
    refresh: ['content-script.js'],
  },
  listenDir: path.resolve('./src'),
  reloadDir: ['background', 'content']
})

// your project
output
	- background.js
	- content-script.js
	- sidepanel.js
	- ...
src
	- background
		- main.js
	- content
		- main.js
	- sidepanel
		- ...
webpack.config.js
```

### How it works

1. Starts a local WebSocket server.
2. Starts a `chokidar` watcher, reading the `reloadDir` configuration.
3. Reads the `injections` configuration, calls Webpack hooks to inject code. After compilation, it pushes messages to the client. If the changed file matches the `reloadDir` configuration, it reloads the extension background and web pages.

### Contribute

The author has limited capacity and has only implemented the Webpack 5 plugin. If you are using other tools such as Vite or want to adapt it to Webpack 3/4, you are welcome to contact the author and contribute to this open-source project.

#### Github Link

https://github.com/GITfsj/ExtensionHmrReloadPlugin/blob/main/README.md

```shell
npm install
npm run build
```

#### NPM Link

```shell
npm install --save-dev extension-hmr-reload-plugin
```