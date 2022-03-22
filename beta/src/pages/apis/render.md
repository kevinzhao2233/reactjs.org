---
title: render
---

<Intro>

`render` renders a piece of [JSX](/learn/writing-markup-with-jsx) ("React node") into a browser DOM node.

`render` 可以将一段[JSX](/learn/writing-markup-with-jsx)（“React node”）渲染到浏览器的 DOM 节点。

```js
render(reactNode, domNode, callback?)
```

</Intro>

- [使用](#usage)
  - [渲染根组件](#rendering-the-root-component)
  - [渲染多个根](#rendering-multiple-roots)
  - [更新渲染树](#updating-the-rendered-tree)
- [参考](#reference)
  - [`render(reactNode, domNode, callback?)`](#render)

---

## 使用 {/* usage */}

Call `render` to display a <CodeStep step={1}>React component</CodeStep> inside a <CodeStep step={2}>browser DOM node</CodeStep>.

调用 `render` 来展示一个 <CodeStep step={1}>React 组件</CodeStep> 到 <CodeStep step={2}>浏览器 DOM 节点</CodeStep>。

```js [[1, 4, "<App />"], [2, 4, "document.getElementById('root')"]]
import {render} from 'react-dom';
import App from './App.js';

render(<App />, document.getElementById('root'));
```

### 渲染根组件 {/* rendering-the-root-component */}

In apps fully built with React, **you will usually only do this once at startup**--to render the "root" component.

在完全用 React 构建的应用程序中，**通常只在启动时做一次** ——渲染“根”组件。

<Sandpack>

```js index.js active
import './styles.css';
import {render} from 'react-dom';
import App from './App.js';

render(<App />, document.getElementById('root'));
```

```js App.js
export default function App() {
  return <h1>Hello, world!</h1>;
}
```

</Sandpack>

Usually you shouldn't need to call `render` again or to call it in more places. From this point on, React will be managing the DOM of your application. If you want to update the UI, your components can do this by [using state](/apis/usestate).

通常你不需要再次调用 `render` 或者在更多的地方调用它。从这一刻起，React 将管理你的应用程序中的 DOM。如果想要更新 UI，你的组件可以通过[使用 state](/apis/usestate) 来完成。

---

### 渲染多个根 {/* rendering-multiple-roots */}

If your page [isn't fully built with React](/learn/add-react-to-a-website), call `render` for each top-level piece of UI managed by React.

如果你的页面[没有完全用 React 构建](/learn/add-react-to-a-website)，为 React 管理的每个顶层 UI 调用`render`。

<Sandpack>

```html public/index.html
<nav id="navigation"></nav>
<main>
  <p>This paragraph is not rendered by React (open index.html to verify).</p>
  <section id="comments"></section>
</main>
```

```js index.js active
import './styles.css';
import { render } from 'react-dom';
import { Comments, Navigation } from './Components.js';

render(
  <Navigation />,
  document.getElementById('navigation')
);

render(
  <Comments />,
  document.getElementById('comments')
);
```

```js Components.js
export function Navigation() {
  return (
    <ul>
      <NavLink href="/">Home</NavLink>
      <NavLink href="/about">About</NavLink>
    </ul>
  );
}

function NavLink({ href, children }) {
  return (
    <li>
      <a href={href}>{children}</a>
    </li>
  );
}

export function Comments() {
  return (
    <>
      <h2>Comments</h2>
      <Comment text="Hello!" author="Sophie" />
      <Comment text="How are you?" author="Sunil" />
    </>
  );
}

function Comment({ text, author }) {
  return (
    <p>{text} — <i>{author}</i></p>
  );
}
```

```css
nav ul { padding: 0; margin: 0; }
nav ul li { display: inline-block; margin-right: 20px; }
```

</Sandpack>

You can destroy the rendered trees with [`unmountComponentAtNode()`](TODO).

你可以使用 [`unmountComponentAtNode()`](TODO) 销毁渲染树。

---

### 更新渲染树 {/* updating-the-rendered-tree */}

You can call `render` more than once on the same DOM node. As long as the component tree structure matches up with what was previously rendered, React will [preserve the state](/learn/preserving-and-resetting-state). Notice how you can type in the input, which means that the updates from repeated `render` calls every second in this example are not destructive:

可以在同一个 DOM 节点上多次调用 render。只要组件树结构与之前呈现的匹配，React 将[保存状态](learn/preserving-and-resetting-state)。注意，你可以在 input 中输入，这意味在这个例子中，每秒钟重复调用 `render` 来更新是没有破坏性的：

<Sandpack>

```js index.js active
import {render} from 'react-dom';
import './styles.css';
import App from './App.js';

let i = 0;
setInterval(() => {
  render(<App counter={i} />, document.getElementById('root'));
  i++;
}, 1000);
```

```js App.js
export default function App({counter}) {
  return (
    <>
      <h1>Hello, world! {counter}</h1>
      <input placeholder="Type something here" />
    </>
  );
}
```

</Sandpack>

It is uncommon to call `render` multiple times. Usually, you'll [update state](/apis/usestate) inside one of the components instead.

多次调用 `render` 是不常见的。相反，通常你会在一个组件内[更新状态](/apis/usestate)。

---

## 参考 {/* reference */}

### `render(reactNode, domNode, callback?)` {/* render */}

Call `render` to display a React component inside a browser DOM element.

调用 `render` 在浏览器 DOM 元素内展示一个 React 组件。

```js
const domNode = document.getElementById('root');
render(<App />, domNode);
```

React will display `<App />` in the `domNode`, and take over managing the DOM inside it.

An app fully built with React will usually only have one `render` call with its root component. A page that uses "sprinkles" of React for parts of the page may have as many `render` calls as needed.

React 会在 `domNode` 中展示 `<App />`，并接管其中的 DOM。

完全使用 React 构建的应用程序通常只在一个根组件上调用 `render`。对于页面的某些部分使用了“零星的” React 页面，可以根据需要调用尽可能多的 `render`。

[参见上面的例子。](#usage)

#### 参数 {/* parameters */}

- `reactNode`: A _React node_ that you want to display. This will usually be a piece of JSX like `<App />`, but you can also pass a React element constructed with [`createElement()`](TODO), a string, a number, `null`, or `undefined`.

- `domNode`: A [DOM element](https://developer.mozilla.org/en-US/docs/Web/API/Element). React will display the `reactNode` you pass inside this DOM element. From this moment, React will manage the DOM inside the `domNode` and update it when your React tree changes.

- **optional** `callback`: A function. If passed, React will call it after your component is placed into the DOM.

- `reactNode`：一个你想要展示的 _React 节点_。这通常是一个 JSX 片段，类似 `<App />`, 当然你也可以传递一个由 [`createElement()`](TODO) 构建的 React 元素，一个字符串，一个数字，`null`，或者 `undefined`。

- `domNode`：一个 [DOM 元素](https://developer.mozilla.org/en-US/docs/Web/API/Element). React 将在这个 DOM 元素中展示传递来的 `reactNode`。从这一刻起，React 将接管 `domNode` 中的 DOM，并在 React 树发生变化时更新它。

- **可选的** `callback`：一个函数，如果传入，React 会在你的组件被放入 DOM 后调用它。

#### 返回 {/* returns */}

`render` 通常返回 `null`. 但是，如果你传递的 `reactNode` 是一个_类组件_，那么它将返回该组件的实例。

#### 注意事项 {/* caveats */}

- The first time you call `render`, React will clear all the existing HTML content inside the `domNode` before rendering the React component into it. If your `domNode` contains HTML generated by React on the server or during the build, use [`hydrate()`](TODO) instead, which attaches the event handlers to the existing HTML.

- 当你第一次调用 `render` 时，React 会在渲染 React 组件到 `domNode` 之前清除掉所有已存在的 HTML 内容。如果 `domNode` 中包含由 React 在服务器上或在构建期间生成的 HTML，可以使用 [`hydrate()`](TODO)，它会将事件处理程序附加到现有的 HTML。

- If you call `render` on the same `domNode` more than once, React will update the DOM as necessary to reflect the latest JSX you passed. React will decide which parts of the DOM can be reused and which need to be recreated by ["matching it up"](/learn/preserving-and-resetting-state) with the previously rendered tree. Calling `render` on the same `domNode` again is similar to calling the [`set` function](/apis/usestate#setstate) on the root component: React avoids unnecessary DOM updates.

- 如果在同一个 `domNode` 上多次调用 `render`，React 将根据需要来更新 DOM，以反映你传递的最新的 JSX。React 将决定 DOM 的哪些部分可以重用，哪些需要与之前的渲染树[进行匹配](/learn/preserving-and-resetting-state)。在同一个 `domNode` 上再次调用 `render` 类似于在根组件上调用 [set 函数](/apis/usestate#setstate)：React 避免了不必要的 DOM 更新。

- If your app is fully built with React, you'll likely have only one `render` call in your app. (If you use a framework, it might do this call for you.) When you want to render a piece of JSX in a different part of the DOM tree that isn't a child of your component (for example, a modal or a tooltip), use [`createPortal`](TODO) instead of `render`.

- 如果你的应用完全是用React构建的，你的应用程序中可能只需要调用一次 `render`。（如果你使用一个框架，它可能会默认为你做这个调用。）当你想要在 DOM 树的不同部分呈现一部分 JSX，而该部分不是组件的子组件时（例如，modal 或 tooltip），请使用 [`createPortal`](TODO) 而不是 `render`。

---
