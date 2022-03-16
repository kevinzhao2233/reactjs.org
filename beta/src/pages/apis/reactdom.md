---
title: ReactDOM API
---

<Intro>

The ReactDOM package lets you render React components on a webpage.

ReactDOM 允许你在网页上渲染 React 组件。

</Intro>

Typically, you will use ReactDOM at the top level of your app to display your components. You will either use it directly or a [framework](/learn/start-a-new-react-project#building-with-react-and-a-framework) may do it for you. Most of your components should *not* need to import this module.

通常，你将在应用程序的顶层使用 ReactDOM 来展示组件。您可以直接使用它，也可以使用一个[框架](/learn/start-a-new-react-project#building-with-react-and-a-framework)。大多数组件都*不* 需要导入此模块。

## 安装 {/*installation*/}

<PackageImport>

<TerminalBlock>

npm install react-dom

</TerminalBlock>

```js
// 导入一个特定的 API:
import { render } from 'react-dom';

// 一起导入所有 API:
import * as ReactDOM from 'react';
```

</PackageImport>

You'll also need to install the same version of [React](/api/).

你还需要安装相同版本的 [React](/api/)。

## 浏览器支持情况 {/*browser-support*/}

ReactDOM supports all popular browsers, including Internet Explorer 9 and above. [Some polyfills are required](http://todo%20link%20to%20js%20environment%20requirements/) for older browsers such as IE 9 and IE 10.

ReactDOM 支持所有流行的浏览器，包括 IE9 及以上版本。旧的浏览器如 IE9 和 IE10 会[需要一些 polyfills](http://todo%20link%20to%20js%20environment%20requirements/)

## Exports {/*exports*/}

<YouWillLearnCard title="render" path="/apis/render">

Displays a React component inside a browser DOM node.

在浏览器 DOM 节点中展示 React 组件。

```js
render(<App />, document.getElementById('root'));
```

</YouWillLearnCard>

This section is incomplete and is still being written!
