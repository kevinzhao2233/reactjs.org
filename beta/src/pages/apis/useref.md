---
title: useRef
---

<Intro>

`useRef` is a React Hook that lets you reference a value that's not needed for rendering.

`useRef` 是一个 React Hook，可以让你引用一个在渲染时不需要的值。

```js
const ref = useRef(initialValue)
```

</Intro>

- [使用](#usage)
  - [使用 ref 引用一个值](#referencing-a-value-with-a-ref)
  - [使用 ref 操作 DOM](#manipulating-the-dom-with-a-ref)
  - [从组件暴露 ref](#exposing-a-ref-from-your-component)
  - [避免重新创建 ref 内容](#avoiding-recreating-the-ref-contents)
- [参考](#reference)
  - [`useRef(initialValue)`](#useref)
- [疑难解答](#troubleshooting)
  - [我不能获取自定义组件的 ref](#i-cant-get-a-ref-to-a-custom-component)

---

## 使用 {/*usage*/}

### 使用 ref 引用一个值 {/*referencing-a-value-with-a-ref*/}

Call `useRef` at the top level of your component to declare one or more [refs](/learn/referencing-values-with-refs).

在组件的顶层调用 `useRef` 申明一个或多个 [ref](/learn/referencing-values-with-refs)。

```js [[1, 4, "intervalRef"], [3, 4, "0"]]
import { useRef } from 'react';

function Stopwatch() {
  const intervalRef = useRef(0);
  // ...
```

`useRef` returns a <CodeStep step={1}>ref object</CodeStep> with a single <CodeStep step={2}>`current` property</CodeStep> initially set to the <CodeStep step={3}>initial value</CodeStep> you provided.

`useRef` 返回一个 <CodeStep step={1}>ref 对象</CodeStep> ，其单个 <CodeStep step={2}>`current` 属性</CodeStep> 最初被设置为你提供的 <CodeStep step={3}>初始值</CodeStep>。

On the next renders, `useRef` will return the same object. You can change its `current` property to store information and read it later. This might remind you of [state](/apis/usestate), but there is an important difference.

在下一次渲染时，`useRef` 将返回相同的对象。你可以更改其 `current` 属性来存储信息并在以后读取。这可能会让你想起 [state](/apis/usestate)，但有一个重要的区别。

**Changing a ref does not trigger a re-render.** This means refs are perfect for storing information that doesn't affect the visual output of your component. For example, if you need to store an [interval ID](https://developer.mozilla.org/en-US/docs/Web/API/setInterval) and retrieve it later, you can put it in a ref. To update the value inside the ref, you need to manually change its <CodeStep step={2}>`current` property</CodeStep>:

**改变 ref 不需要触发重新渲染。**这意味着 ref 非常适合存储不影响组件视觉输出的信息。比如，你需要存储一个 [interval ID](https://developer.mozilla.org/en-US/docs/Web/API/setInterval) 并且在以后恢复，你可以将其放到 ref。更新 ref 中的值，你需要手动改变它的<CodeStep step={2}>`current` 属性</CodeStep>。

```js [[2, 5, "intervalRef.current"]]
function handleStartClick() {
  const intervalId = setInterval(() => {
    // ...
  }, 1000);
  intervalRef.current = intervalId;
}
```

Later, you can read that interval ID from the ref so that you can call [clear that interval](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval):

稍后，你可以从 ref 中读取 interval ID，这样你就可以调用 [clear interval](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval)

```js [[2, 2, "intervalRef.current"]]
function handleStopClick() {
  const intervalId = intervalRef.current;
  clearInterval(intervalId);
}
```

By using a ref, you ensure that:

通过使用 ref，你可以确保：

- You can **store information** between re-renders. (Unlike regular variables, which reset on every render.)
- Changing it **does not trigger a re-render**. (Unlike state variables, which trigger a re-render.)
- The **information is local** to each copy of your component. (Unlike the variables outside, which are shared.)

- 你可以在重新渲染期间**存储信息**。（与在每次渲染时重置的常规变量不同。）
- 更改它**不会触发重新渲染**。（与触发重新渲染的 state 不同。）
- 该信息对于组件的每个副本都是**局部作用域的**。（与外部变量不同，外部变量是共享的。）

Changing a ref does not trigger a re-render, so refs are not appropriate for storing information that you want to display on the screen. Use state for that instead. Read more about [choosing between `useRef` and `useState`](/learn/referencing-values-with-refs#differences-between-refs-and-state).

更改 ref 不会触发重新渲染，因此 ref 不适合存储要在屏幕上显示的信息，请改用 state。阅读[在 `useRef` 和 `useState` 之间进行选择](/learn/referencing-values-with-refs#differences-between-refs-and-state)了解更多信息。

<Recipes titleText="举例：使用 useRef 引用值" titleId="examples-value">

### 点击计数器 {/*click-counter*/}

This component uses a ref to keep track of how many times the button was clicked. Note that it's okay to use a ref instead of state here because the click count is only read and written in an event handler.

该组件使用 ref 跟踪按钮被点击的次数。请注意，这里可以使用 ref 而不是 state，因为单击计数只在事件处理程序中读取和写入。

<Sandpack>

```js
import { useRef } from 'react';

export default function Counter() {
  let ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    alert('You clicked ' + ref.current + ' times!');
  }

  return (
    <button onClick={handleClick}>
      Click me!
    </button>
  );
}
```

</Sandpack>

If you show `{ref.current}` in the JSX, the number won't update on click. This is because setting `ref.current` does not trigger a re-render. Information that's used for rendering should be state instead.

如果你想在 JSX 中展示 `{ref.current}`，该数字不会在单击时更新。这是因为设置 `ref.current` 不会触发重新渲染。应该用 state 渲染信息。

<Solution />

### 秒表 {/*a-stopwatch*/}

This example uses a combination of state and refs. Both `startTime` and `now` are state variables because they are used for rendering. But we also need to hold an [interval ID](https://developer.mozilla.org/en-US/docs/Web/API/setInterval) so that we can stop the interval on button press. Since the interval ID is not used for rendering, it's appropriate to keep it in a ref, and manually update it.

这个例子使用了 state 和 ref 的组合。`startTime` 和 `now` 都是 state，因为它们用于渲染。但我们还需要保存一个 [interval ID](https://developer.mozilla.org/en-US/docs/Web/API/setInterval)，这样我们就可以在按钮按下时停止 interval。因为interval ID 不用于渲染，所以将它保存在 ref 中并手动更新它是合适的。

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Stopwatch() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);
  const intervalRef = useRef(null);

  function handleStart() {
    setStartTime(Date.now());
    setNow(Date.now());

    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setNow(Date.now());
    }, 10);
  }

  function handleStop() {
    clearInterval(intervalRef.current);
  }

  let secondsPassed = 0;
  if (startTime != null && now != null) {
    secondsPassed = (now - startTime) / 1000;
  }

  return (
    <>
      <h1>Time passed: {secondsPassed.toFixed(3)}</h1>
      <button onClick={handleStart}>
        Start
      </button>
      <button onClick={handleStop}>
        Stop
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

</Recipes>

<Gotcha>

**Do not write _or read_ `ref.current` during rendering.**

**不要在渲染时对 `ref.current` 进行读*或写***

React expects that the body of your component [behaves like a pure function](/learn/keeping-components-pure):

React希望你的组件的主体[行为像一个纯函数](/learn/keeping-components-pure):

- If the inputs ([props](/learn/passing-props-to-a-component), [state](/learn/state-a-components-memory), and [context](/learn/passing-data-deeply-with-context)) are the same, it should return exactly the same JSX.
- Calling it in a different order or with different arguments should not affect the results of other calls.

- 如果输入（[props](/learn/passing-props-to-a-component), [state](/learn/state-a-components-memory), 和 [context](/learn/passing-data-deeply-with-context)）相同，那么应该得到完全相同的 JSX。
- 以不同的顺序或不同的参数调用它不应该影响其他调用的结果。

Reading or writing a ref **during rendering** breaks these expectations.

在**渲染时**读或写 ref 就打破了这些期望。

```js {3-4,6-7}
function MyComponent() {
  // ...
  // 🚩 Don't write a ref during rendering
  myRef.current = 123;
  // ...
  // 🚩 Don't read a ref during rendering
  return <h1>{myOtherRef.current}</h1>;
}
```

You can read or write refs **from event handlers or effects instead**.

你应该在**事件处理程序或 effects 中**读或写 ref。

```js {4-5,9-10}
function MyComponent() {
  // ...
  useEffect(() => {
    // ✅ You can read or write refs in effects
    myRef.current = 123;
  });
  // ...
  function handleClick() {
    // ✅ You can read or write refs in event handlers
    doSomething(myOtherRef.current);
  }
  // ...
}
```

If you *have to* read [or write](/apis/usestate#storing-information-from-previous-renders) something during rendering, [use state](/apis/usestate) instead.

如果你需要在渲染时读[或写](/apis/usestate#storing-information-from-previous-renders)某个东西，请[使用 state](/apis/usestate) 代替.

When you break these rules, your component might still work, but most of the newer features we're adding to React will rely on these expectations. Read more about [keeping your components pure](/learn/keeping-components-pure#where-you-can-cause-side-effects).

当你打破这些规则时，你的组件可能依然正常工作，但是我们添加到 React 中的大多数新特性都依赖于这些期望。阅读更多关于[保持组件纯净的内容](/learn/keeping-components-pure#where-you-can-cause-side-effects)。

</Gotcha>

---

### 使用 ref 操作 DOM {/*manipulating-the-dom-with-a-ref*/}

It's particularly common to use a ref to manipulate the [DOM](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API). React has bulit-in support for this.

使用 ref 来操作 [DOM](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API) 是非常常见的。React 对此提供了内置支持。 首先，声明一个初始值为 null 的 ref 对象:

First, declare a <CodeStep step={1}>ref object</CodeStep> with an <CodeStep step={3}>initial value</CodeStep> of `null`:

首先，通过值为 `null`的 <CodeStep step={3}>初始值</CodeStep> 申明一个 <CodeStep step={1}>ref 对象</CodeStep>：

```js [[1, 4, "inputRef"], [3, 4, "null"]]
import { useRef } from 'react';

function MyComponent() {
  const inputRef = useRef(null);
  // ...
```

Then pass your ref object as the `ref` attribute to the JSX of the DOM node you want to manipulate:

然后将 ref 对象作为 `ref` 属性传递给要操作的 DOM 节点的 JSX：

```js [[1, 2, "inputRef"]]
  // ...
  return <input ref={inputRef} />;
```

After React creates the DOM node and puts it on the screen, React will set the <CodeStep step={2}>`current` property</CodeStep> of your ref object to that DOM node. Now you can access the `<input>`'s DOM node and call methods like [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus):

在 React 创建 DOM 节点并将其放在屏幕上之后，React 会将 ref 对象的 <CodeStep step={2}>`current` 属性</CodeStep>设置为该 DOM 节点。现在你可以访问 `<input>` 的 DOM 节点并调用像 [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) 这样的方法:

```js [[2, 2, "inputRef.current"]]
  function handleClick() {
    inputRef.current.focus();
  }
```

React will set the `current` property back to `null` when the node is removed from the screen.

当节点从屏幕上移除，React 会将其 `current` 属性设置回 `null`。

Read more about [manipulating the DOM with refs](/learn/manipulating-the-dom-with-refs).

阅读[使用 ref 操作 DOM ](/learn/manipulating-the-dom-with-refs)了解更多

<Recipes titleText="举例：使用 ref 操作 DOM" titleId="examples-dom">

### 聚焦文本框 {/*focusing-a-text-input*/}

In this example, clicking the button will focus the input:

在这个例子中，点击按钮可以聚焦 input：

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

### 将图片滚动到视窗 {/*scrolling-an-image-into-view*/}

In this example, clicking the button will scroll an image into view. It uses a ref to the list DOM node, and then calls DOM [`querySelectorAll`](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll) API to find the image we want to scroll to.

在这个例子中，点击按钮将滚动图片到视窗。使用指向列表 DOM 节点的 ref，然后调用 DOM 的 [`querySelectorAll`](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll) 接口在找到我们希望滚动的图片。

<Sandpack>

```js
import { useRef } from 'react';

export default function CatFriends() {
  const listRef = useRef(null);

  function scrollToIndex(index) {
    const listNode = listRef.current;
    // This line assumes a particular DOM structure:
    const imgNode = listNode.querySelectorAll('li > img')[index];
    imgNode.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  return (
    <>
      <nav>
        <button onClick={() => scrollToIndex(0)}>
          Tom
        </button>
        <button onClick={() => scrollToIndex(1)}>
          Maru
        </button>
        <button onClick={() => scrollToIndex(2)}>
          Jellylorum
        </button>
      </nav>
      <div>
        <ul ref={listRef}>
          <li>
            <img
              src="https://placekitten.com/g/200/200"
              alt="Tom"
            />
          </li>
          <li>
            <img
              src="https://placekitten.com/g/300/200"
              alt="Maru"
            />
          </li>
          <li>
            <img
              src="https://placekitten.com/g/250/200"
              alt="Jellylorum"
            />
          </li>
        </ul>
      </div>
    </>
  );
}
```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>

<Solution />

### 播放和暂停视频 {/*playing-and-pausing-a-video*/}

This example uses a ref to call [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) and [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) on a `<video>` DOM node.

这个例子使用 ref 调用 `<video>` DOM 节点的 [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) 和 [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause)。

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const ref = useRef(null);

  function handleClick() {
    const nextIsPlaying = !isPlaying;
    setIsPlaying(nextIsPlaying);

    if (nextIsPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }

  return (
    <>
      <button onClick={handleClick}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <video
        width="250"
        ref={ref}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          type="video/mp4"
        />
      </video>
    </>
  )
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

<Solution />

### 在自己的组件上暴露 ref {/*exposing-a-ref-to-your-own-component*/}

Sometimes, you may want to let the parent component manipulate the DOM inside of your component. For example, maybe you're writing a `MyInput` component, but you want the parent to be able to focus the input (which the parent has no access to). You can use a combination of `useRef` to hold the input and [`forwardRef`](/apis/forwardref) to expose it to the parent component. Read a [detailed walkthrough](/learn/manipulating-the-dom-with-refs#accessing-another-components-dom-nodes) here.

有时候，你可能想让父组件操作你的组件中的 DOM。例如，也许你正在编写一个 `MyInput` 组件，但是你希望父组件能够聚焦 input（父组件没有访问权限）。你可以组合使用 `useRef` 保存 input，并使用 [`forwardRef`](/apis/forwardref) 将其暴露给父组件。请在这里阅读[详细的演练](/learn/manipulating-the-dom-with-refs#accessing-another-components-dom-nodes)。

<Sandpack>

```js
import { forwardRef, useRef } from 'react';

const MyInput = forwardRef((props, ref) => {
  return <input {...props} ref={ref} />;
});

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

</Recipes>

---

### 避免重新创建 ref 内容 {/*avoiding-recreating-the-ref-contents*/}

React saves the initial ref value once and ignores it on the next renders.

React 将初始 ref 值保存一次，并在下一次渲染时忽略它。

```js
function Video() {
  const playerRef = useRef(new VideoPlayer());
  // ...
```

Although the result of `new VideoPlayer()` is only used for the initial render, you're still calling this function on every render. This can be wasteful if it's creating expensive objects.

虽然 `new VideoPlayer()` 的结果仅用于初始渲染，但你仍在每次渲染时调用此函数。如果创建昂贵的对象，这可能是浪费。

To solve it, you may initialize the ref like this instead:

为了解决这个问题，你可以像这样初始化 ref：

```js
function Video() {
  const playerRef = useRef(null);
  if (playerRef.current === null) {
    playerRef.current = new VideoPlayer();
  }
  // ...
```

Normally, writing or reading `ref.current` during render is not allowed. However, it's fine in this case because the result is always the same, and the condition only executes during initialization so it's fully predictable.



<DeepDive title="如何在以后初始化 useRef 时避免检查是否为 null">

If you use a type checker and don't want to always check for `null`, you can try a pattern like this instead:

如果你使用类型检查器，但不想总是检查 `null`，可以尝试以下模式：

```js
function Video() {
  const playerRef = useRef(null);

  function getPlayer() {
    if (playerRef.current !== null) {
      return playerRef.current;
    }
    const player = new VideoPlayer();
    playerRef.current = player;
    return player;
  }

  // ...
```

Here, the `playerRef` itself is nullable. However, you should be able to convince your type checker that there is no case in which `getPlayer()` returns `null`. Then use `getPlayer()` in your event handlers.

这里，`playerRef` 本身是空的。但是，你应该能够使类型检查器相信，`getPlayer()` 不会返回 `null`。然后在事件处理程序中使用 `getPlayer()`。

</DeepDive>

---

## 参考 {/*reference*/}

### `useRef(initialValue)` {/*useref*/}

Call `useRef` at the top level of your component to declare a [ref](/learn/referencing-values-with-refs).

在组件的顶层调用 `useRef` 来声明一个 [ref](/learn/referencing-values-with-refs)

```js
import { useRef } from 'react';

function MyComponent() {
  const intervalRef = useRef(0);
  const inputRef = useRef(null);
  // ...
```

See examples of [referencing values](#examples-value) and [DOM manipulation](#examples-dom).

#### 参数 {/*parameters*/}

* `initialValue`: The value you want the ref object's `current` property to be initially. It can be a value of any type. This argument is ignored after the initial render.

* `initialValue`：你希望 ref 对象的 `current` 属性最初被赋的值。

#### 返回值 {/*returns*/}

`useRef` returns an object with a single property:

`useRef` 返回只有一个属性的对象：

* `current`: Initially, it's set to the `initialValue` you have passed. You can later set it to something else. If you pass the ref object to React as a `ref` attribute to a JSX node, React will set its `current` property.

* `current`：起初，它被设置为你传入的 `initialValue`。你可以稍后设置将其设置为其他内容。如果将 ref 对象作为 JSX 节点的 `ref` 属性，React 将设置 JSX 节点为 `current` 属性。

On the next renders, `useRef` will return the same object.

在下一次渲染，`useRef` 会返回同一对象。

#### 注意事项 {/*caveats*/}

* You can mutate the `ref.current` property. Unlike state, it is mutable. However, if it holds an object that is used for rendering (for example, a piece of your state), then you shouldn't mutate that object.
* When you change the `ref.current` property, React does not re-render your component. React is not aware of when you change it because a ref is a plain JavaScript object.
* Do not write _or read_ `ref.current` during rendering, except for [initialization](#avoiding-recreating-the-ref-contents). This makes your component's behavior unpredictable.
* In Strict Mode, React will **call your component function twice** in order to [help you find accidental impurities](#my-initializer-or-updater-function-runs-twice). This is development-only behavior and does not affect production. This means that each ref object will be created twice, and one of the versions will be discarded. If your component function is pure (as it should be), this should not affect the logic of your component.
* 你可以对 `ref.current` 属性进行改变。与 state 不同，它是可变的。但是，如果它包含一个用于渲染的对象（例如，state 的一部分），则不应修改该对象。
* 当你更改 `ref.current` 属性，React 不会重新渲染组件。React 不知道你何时更改它，因为 ref 是一个普通的 JavaScript 对象。
* 不要在渲染期间写或读 `ref.current`，除了 [initialization](#avoiding-recreating-the-ref-contents)。这使得组件的行为不可预测。
* 在严格模式下，React 会**调用你的组件函数两次**，以[帮助你发现意外情况](#my-initializer-or-updater-function-runs-twice)。这是仅在开发环境的行为，不会影响生产环境。这意味着每个 ref 对象将被创建两次，其中一个版本将被丢弃。如果你的组件函数是纯函数(它应该是)，这应该不会影响组件的逻辑。

---

## 疑难解答 {/*troubleshooting*/}

### 我不能获取自定义组件的 ref {/*i-cant-get-a-ref-to-a-custom-component*/}

If you try to pass a `ref` to your own component like this:

如果你尝试给你自己的组件传入 `ref`，类似这样：

```js
const inputRef = useRef(null);

return <MyInput ref={inputRef} />
```

You might get an error in the console:

你或许会在控制台获得一个 error：

<ConsoleBlock level="error">

Warning: Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?

</ConsoleBlock>

By default, your own components don't expose refs to the DOM nodes inside them.

默认情况下，你自己的组件不会将其中的 DOM 节点暴露 ref。

To fix this, find the component that you want to get a ref to:

要解决这一的问题，请找到需要获取 ref 的组件：

```js
export default function MyInput({ value, onChange }) {
  return (
    <input
      value={value}
      onChange={onChange}
    />
  );
}
```

And then wrap it in [`forwardRef`](/apis/forwardref) like this:

然后将它包裹到 [`forwardRef`](/apis/forwardref) 里，就像这样：

```js {3,8}
import { forwardRef } from 'react';

const MyInput = forwardRef(({ value, onChange }, ref) => {
  return (
    <input
      value={value}
      onChange={onChange}
      ref={ref}
    />
  );
});

export default MyInput;
```

Then the parent component can get a ref to it.

然后父组件可以获得对它的引用。

Read more about [accessing another component's DOM nodes](/learn/manipulating-the-dom-with-refs#accessing-another-components-dom-nodes).

阅读 [访问另一个组件的 DOM 节点](/learn/manipulating-the-dom-with-refs#accessing-another-components-dom-nodes) 了解更多

React 的 Ref 不能像 Vue 一样，直接将组件作为 ref，只能将组件里的某个元素作为 ref。也就是说不能通过 ref 操作组件，只能用 ref 操作组件内的某个元素。