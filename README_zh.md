## Extension-hmr-reload-plugin

[![英文版](https://img.shields.io/badge/lang-English-blue.svg)](README.md)   [![中文版](https://img.shields.io/badge/lang-中文-blue.svg)](README_zh.md) 


### What is it

这是一个适用于开发浏览器扩展（chrome/edge/firefox）的热更新Webpack插件。随着AI的来袭和现代浏览器功能的更新，AI类浏览器扩展应用逐渐涌现。如果您对浏览器扩展开发和webpack感兴趣，希望这能帮到您。

### Features

- 开发模式下 `background` 和 `content-script` 的自动重载，无需频繁手动重载扩展
- 使用 `webextension-polyfill` 兼容不同浏览器
- 友好的ts类型提示

### Which env is avaliable

webpack5及基于webpack5搭建的脚手架。如果您的项目是webpack4

### Why was it created

本地开发浏览器扩展时，由于本地安装调试的特性和浏览器限制，`background` 和 `content-script` 不会自动更新，即使本地文件确实已经被更新，这需要开发者手动在浏览器刷新扩展文件（background）和网页（content-script）。
该插件提供了自动重新加载扩展程序和刷新相关网页的能力。

### How to use

在webpack：

```javascript
const { HmrReloadPlugin } = require("extension-hmr-reload-plugin")
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

插件服务端口，默认`4001`

#### injections

指定需要被注入热重载脚本的文件名数组，文件名在您的输出目录下查看，如：

```shell
# your outputdir
output 
	- background.js
	- background.xxx.js
	- content
		- content-script.js
	- sidepanel.js
	- ...
```

所以您可以这样填写，文件名将以包含关系被匹配

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

监听的目录，默认值为配置文件的当前同级路径 `./`

### reloadDir

string[]

期望文件更改后触发重载的目录，默认值 `background`。请根据您的项目结构进行填写，以下是一个项目结构示例：

```shell
# your project
src
	- background
		- ...
webpack.config.js
```

示例配置：

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

1. 启动本地websocket服务器
2. 启动chokidar监听，读取reloadDir配置
3. 读取injections配置，调用webpack hooks注入代码，编译完成后向client推送消息，若更改文件符合reloadDir配置，则重载扩展background和网页

### Contribute

作者精力有限，仅实现webpack5插件，如果您使用的是vite等其他工具或想适配webpack3/4，欢迎联系作者，贡献您的开源力量。

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