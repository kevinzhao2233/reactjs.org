---
title: React APIs
---

<Intro>

The React package contains all the APIs necessary to define and use [components](/learn/your-first-component).

React包包含定义和使用[组件](/learn/your-first-component)所需的所有API。

</Intro>

## 安装 {/*installation*/}

它以 [`react`](https://www.npmjs.com/package/react) 的形式在 npm 上提供。你也可以 [用 `<script>` 标签的形式添加到页面](/learn/add-react-to-a-website).

<PackageImport>

<TerminalBlock>

npm install react

</TerminalBlock>

```js
// 导入一个特定的 API
import { useState } from 'react';

// 一起导入所有 API
import * as React from 'react';
```

</PackageImport>

If you use React on the web, you'll also need the same version of [ReactDOM](/api/reactdom).

如果在你需要在浏览器环境使用 React，还需要安装相同版本的 [ReactDOM](/api/reactdom).

## Exports {/*exports*/}

### State {/*state*/}

<YouWillLearnCard title="useState" path="/apis/usestate">

Declares a state variable.

声明一个状态变量。

```js
function MyComponent() {
  const [age, setAge] = useState(42);
  // ...
```

</YouWillLearnCard>

<YouWillLearnCard title="useReducer" path="/apis/usereducer">

Declares a state variable managed with a reducer.

声明一个由 reducer 管理的状态变量。

```js
function MyComponent() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });
  // ...
```

</YouWillLearnCard>

### Context {/*context*/}

<YouWillLearnCard title="useContext" path="/apis/usecontext">

Reads and subscribes to a context.

读取并订阅一个 context。

```js
function MyComponent() {
  const theme = useContext(ThemeContext);
  // ...
```

</YouWillLearnCard>

### Refs {/*refs*/}

<YouWillLearnCard title="useRef" path="/apis/useref">

Declares a ref.

声明一个 ref。

```js
function MyComponent() {
  const inputRef = useRef(null);
  // ...
```

</YouWillLearnCard>


This section is incomplete and is still being written!
