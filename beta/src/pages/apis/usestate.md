---
title: useState
---

<Intro>

`useState` is a React Hook that lets you add a [state variable](/learn/state-a-components-memory) to your component.

`useState` 是一个 React Hook，用来向组件添加[状态变量](/learn/state-a-components-memory)。

```js
const [state, setState] = useState(initialState)
```

</Intro>

- [使用](#usage)
  - [向组件添加 state](#adding-state-to-a-component)
  - [基于以前的 state 更新 state](#updating-state-based-on-the-previous-state)
  - [更新 state 中的对象和数组](#updating-objects-and-arrays-in-state)
  - [避免重新创建初始 state](#avoiding-recreating-the-initial-state)
  - [用 key 重置 state](#resetting-state-with-a-key)
  - [储存以前渲染的信息](#storing-information-from-previous-renders)
- [参考](#reference)
  - [`useState(initialState)`](#usestate)
  - [`set` 函数, 比如 `setSomething(nextState)`](#setstate)
- [疑难解答](#troubleshooting)
  - [我已经更新了 state，但是日志给我的是旧值](#ive-updated-the-state-but-logging-gives-me-the-old-value)
  - [我已经更新了 state，但是屏幕上还没有更新](#ive-updated-the-state-but-the-screen-doesnt-update)
  - [我得到一个错误: "Too many re-renders"](#im-getting-an-error-too-many-re-renders)
  - [我的初始化函数或 updater 函数运行了两次](#my-initializer-or-updater-function-runs-twice)
  - [我试图将函数设置为 state，但它却被调用了](#im-trying-to-set-state-to-a-function-but-it-gets-called-instead)

---

## 使用 {/*usage*/}

### 向组件添加 state {/*adding-state-to-a-component*/}

Call `useState` at the top level of your component to declare one or more [state variables](/learn/state-a-components-memory).

在**组件的顶层**调用 `useState`，以声明一个或多个[状态变量](/learn/state-a-components-memory)。

```js [[1, 4, "age"], [2, 4, "setAge"], [3, 4, "42"], [1, 5, "name"], [2, 5, "setName"], [3, 5, "'Taylor'"]]
import { useState } from 'react';

function MyComponent() {
  const [age, setAge] = useState(42);
  const [name, setName] = useState('Taylor');
  // ...
```

The convention is to name state variables like `[something, setSomething]` using [array destructuring](/learn/a-javascript-refresher#array-destructuring).

我们有一个惯例，使用[数组解构](/learn/a-javascript-refresher#array-destructuring)的形式，将状态变量命名为 `[something, setSomething]`

`useState` returns an array with exactly two items:

`useState` 返回一个数组，恰好包含两项：

1. The <CodeStep step={1}>current state</CodeStep> of this state variable, initially set to the <CodeStep step={3}>initial state</CodeStep> you provided.
2. The <CodeStep step={2}>`set` function</CodeStep> that lets you change it to any other value in response to interaction.


1. <CodeStep step={1}>当前 state</CodeStep> 是状态变量，其初始值是 <CodeStep step={3}>initial state</CodeStep>。
2. <CodeStep step={2}>`set` 函数</CodeStep> 允许你将其更改为任何其他值以响应交互。

To update what’s on the screen, call the `set` function with some next state:

要更新屏幕上的内容，就调用 `set` 函数来更新到下一个状态。

```js [[2, 2, "setName"]]
function handleClick() {
  setName('Robin');
}
```

React will store the next state, render your component again with the new values, and update the UI.

React 将存储下一个状态，然后使用新值渲染你的组件，并更新 UI。

<Gotcha>

Calling the `set` function [**does not** change the current state in the already executing code](#ive-updated-the-state-but-logging-gives-me-the-old-value):

调用 `set` 函数 [**不能**](#ive-updated-the-state-but-logging-gives-me-the-old-value)在已执行代码中更改当前状态：

```js {3}
function handleClick() {
  setName('Robin');
  console.log(name); // Still "Taylor"!
}
```

It only affects what `useState` will return starting from the *next* render.

在*下一次* 渲染之前，state 的值依然是旧值，所以 `useState` 之后的效果需要等到*下一次* 渲染后看到（意译）。

</Gotcha>

<Recipes titleText="基础 useState 案例" titleId="examples-basic">

### Counter (number) {/*counter-number*/}

In this example, the `count` state variable holds a number. Clicking the button increments it.

在这个例子中，`count` 状态变量保存着一个数字，点击按钮可以使其递增。

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      You pressed me {count} times
    </button>
  );
}
```

</Sandpack>

<Solution />

### Text field (string) {/*text-field-string*/}

In this example, the `text` state variable holds a string. When you type, `handleChange` reads the latest input value from the browser input DOM element, and calls `setText` to update the state. This allows you to display the current `text` below.

在这个例子中，`text` 状态变量保存着一个字符串。当你在输入框中输入时，`handleChange` 会读取 input 框中最新的值，调用 `setText` 来更新 state。允许你在下面显示当前的 `text`。

<Sandpack>

```js
import { useState } from 'react';

export default function MyInput() {
  const [text, setText] = useState('hello');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <>
      <input value={text} onChange={handleChange} />
      <p>You typed: {text}</p>
      <button onClick={() => setText('hello')}>
        Reset
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

### Checkbox (boolean) {/*checkbox-boolean*/}

In this example, the `liked` state variable holds a boolean. When you click the input, `setLiked` updates the `liked` state variable with whether the browser checkbox input is checked. The `liked` variable is used to render the text below the checkbox.

在这个例子中，`liked` 状态变量保存着一个布尔值。当你点击多选框时，`setLiked` 会将复选框是否被选中更新给 `liked` 状态变量。`liked` 用来渲染复选框下方的问文本。

<Sandpack>

```js
import { useState } from 'react';

export default function MyCheckbox() {
  const [liked, setLiked] = useState(true);

  function handleChange(e) {
    setLiked(e.target.checked);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={liked}
          onChange={handleChange}
        />
        I liked this
      </label>
      <p>You {liked ? 'liked' : 'did not like'} this.</p>
    </>
  );
}
```

</Sandpack>

<Solution />

### Form (两个变量) {/*form-two-variables*/}

You can declare more than one state variable in the same component. Each state variable is completely independent.

你可以在一个组件中申明多个状态变量。每个状态变量都是完全独立的。

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  return (
    <>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => setAge(age + 1)}>
        Increment age
      </button>
      <p>Hello, {name}. You are {age}.</p>
    </>
  );
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### 基于以前的 state 更新 state {/*updating-state-based-on-the-previous-state*/}

Suppose the `age` is `42`. This handler calls `setAge(age + 1)` three times:

假设 `age` 是 `42`，此处程序调用 `setAge(age + 1)` 三次

```js
function handleClick() {
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
}
```

However, after one click, `age` will only be `43` rather than `45`! This is because calling the `set` function [does not update](/learn/state-as-a-snapshot) the `age` state variable in the already running code. So each `setAge(age + 1)` call becomes `setAge(43)`.

然而，一次点击后，`age` 只会是 `43`，而不是 `45`！这是因为调用 `set` 函数[不会更新](/learn/state-as-a-snapshot)已经运行的代码中的 `age` 状态变量。所以每次调用 `setAge(age + 1)` 都会变成 `setAge(43)`

To solve this problem, **you may pass an *updater function*** to `setAge` instead of the next state:

解决这一问题，**你可以将一个*updater 函数*** 传递给 `setAge`，而不是传递下一个状态。

```js [[1, 2, "a", 0], [2, 2, "a + 1"], [1, 3, "a", 0], [2, 3, "a + 1"], [1, 4, "a", 0], [2, 4, "a + 1"]]
function handleClick() {
  setAge(a => a + 1); // setAge(42 => 43)
  setAge(a => a + 1); // setAge(43 => 44)
  setAge(a => a + 1); // setAge(44 => 45)
}
```

Here, `a => a + 1` is your updater function. It takes the <CodeStep step={1}>pending state</CodeStep> and calculates the <CodeStep step={2}>next state</CodeStep> from it.

现在，`a => a + 1` 是你的 updater 函数。它接受 <CodeStep step={1}>pending state（挂起状态）</CodeStep>，并从中计算<CodeStep step={2}>下一个状态</CodeStep>。

React puts your updater functions in a [queue](/learn/queueing-a-series-of-state-updates). Then, during the next render, it will call them in the same order:

React 将 updater 函数放入[队列](/learn/queueing-a-series-of-state-updates)中。然后，在下一次渲染时，会以相同的顺序调用它们:

1. `a => a + 1` will receive `42` as the pending state and return `43` as the next state.
1. `a => a + 1` will receive `43` as the pending state and return `44` as the next state.
1. `a => a + 1` will receive `44` as the pending state and return `45` as the next state.


1. `a => a + 1` 将接收 `42` 作为挂起状态并返回 `43` 作为下一个状态。
1. `a => a + 1` 将接收 `43` 作为挂起状态并返回 `44` 作为下一个状态。
1. `a => a + 1` 将接收 `44` 作为挂起状态并返回 `45` 作为下一个状态。

There are no other queued updates, so React will store `45` as the current state in the end.

队列种没有其他的更新，则 React 最终将存储 `45` 作为当前状态。

By convention, it's common to name the pending state argument for the first letter of the state variable name, like `a` for `age`. However, you may also call it like `prevAge` or something else that you find clearer.

按照惯例，将待定状态参数命名为状态变量名的第一个字母是很常见的，比如用 `a` 表示 `age`。然而，你也可以称它为 `prevAge` 或其他你觉得更清楚的词。

React 可能会在开发中[调用两次 updater 函数](#my-initializer-or-updater-function-runs-twice)以验证他们是[纯函数](/learn/keeping-components-pure)组件。

<DeepDive title="使用更新程序总是首选吗？">

You might hear a recommendation to always write code like `setAge(a => a + 1)` if the state you're setting is calculated from the previous state. There is no harm in it, but it is also not always necessary.

你可能会听到一条建议，如果你正在设置的状态是根据前一个状态计算出来的，那么应该始终编写类似于 `setAge(a => a + 1)` 的代码。这没有害处，但也并非总是必要的。

In most cases, there is no difference between these two approaches. React always makes sure that for intentional user actions, like clicks, the `age` state variable would be updated before the next click. This means there is no risk of a click handler seeing a "stale" `age` at the beginning of the event handler.

在大多数情况下，这两种方法没有区别。React 始终确保有意的用户操作，比如单击，`age` 状态变量将在下次单击之前更新。这意味着单击处理程序在事件处理程序的开头不会看到“过时的” `age`。

However, if you do multiple updates within the same event, updaters can be helpful. They're also helpful if accessing the state variable itself is inconvenient (you might run into this when optimizing re-renders).

但是，如果你在同一事件中进行多次更新，updater 函数会很有帮助。如果访问状态变量本身不方便，它们也很有帮助（优化重新渲染时可能会遇到这种情况）。

If you prefer consistency over slightly more verbose syntax, it's reasonable to always write an updater if the state you're setting is calculated from the previous state. If it's calculated from the previous state of some *other* state variable, you might want to combine them into one object and [use a reducer](/learn/extracting-state-logic-into-a-reducer).

如果你喜欢一致性而不是稍微冗长的语法，那么如果你设置的状态是从以前的状态计算出来的，那么总是编写一个 updater 函数是合理的。如果它是从某个*其他*状态变量的前一个状态计算出来的，你可以把它们合并成一个对象并使用一个[ reducer](/learn/extracting-state-logic-into-a-reducer)


</DeepDive>

<Recipes titleText="传递 updater 函数和直接传递下一个状态之间的区别" titleId="examples-updater">

### 传递 updater 函数 {/*passing-the-updater-function*/}

This example passes the updater function, so the "+3" button works.

这个程序传递一个 updater 函数，所以 “+3” 按钮可以正常工作。

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [age, setAge] = useState(42);

  function increment() {
    // a => a + 1 就是 updater 函数
    setAge(a => a + 1);
  }

  return (
    <>
      <h1>Your age: {age}</h1>
      <button onClick={() => {
        // 在一次回调中同时调用了三次 incremen()
        increment();
        increment();
        increment();
      }}>+3</button>
      <button onClick={() => {
        increment();
      }}>+1</button>
    </>
  );
}
```

```css
button { display: block; margin: 10px; font-size: 20px; }
h1 { display: block; margin: 10px; }
```

</Sandpack>

<Solution />

### 直接传入下一个 state {/*passing-the-next-state-directly*/}

这个例子**没有**没有传递 updater 函数, 所以“+3”按钮**没有按预期那样工作**.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [age, setAge] = useState(42);

  function increment() {
    setAge(age + 1);
  }

  return (
    <>
      <h1>Your age: {age}</h1>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <button onClick={() => {
        increment();
      }}>+1</button>
    </>
  );
}
```

```css
button { display: block; margin: 10px; font-size: 20px; }
h1 { display: block; margin: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### 更新 state 中的对象和数组 {/*updating-objects-and-arrays-in-state*/}

You can put objects and arrays into state. In React, state is considered read-only, so **you should *replace* it rather than *mutate* your existing objects**. For example, if you have a `form` object in state, don't update it like this:

可以将对象和数组放在 state 中。在React中，state 被认为是只读的，所以**你应该 *replace（替换）*它，而不是 *mutate（改变）*你现有的对象**。例如，现在有一个 `form` 对象 state，请不要这样更新它：

```js
// 🚩 不要像这样更新对象 state:
form.firstName = 'Taylor';
```

相反，应该创建一个新对象来替换整个对象:

```js
// ✅ 使用新对象替换 state
setForm({
  ...form,
  firstName: 'Taylor'
});
```

阅读[更新 state 中的对象](/learn/updating-objects-in-state)和[更新 state 中的数组](/learn/updating-arrays-in-state) 了解更多.

<Recipes titleText="state 中对象和数组的示例" titleId="examples-objects">

### Form (对象) {/*form-object*/}

In this example, the `form` state variable holds an object. Each input has a change handler that calls `setForm` with the next state of the entire form. The `{ ...form }` spread syntax ensures that the state object is replaced rather than mutated.

在这个例子中，`form` 状态变量中保存着一个对象。每次输入都有一个更改处理程序，该处理程序使用整个表单的下一个状态调用 `setForm`。

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [form, setForm] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com',
  });

  return (
    <>
      <label>
        First name:
        <input
          value={form.firstName}
          onChange={e => {
            setForm({
              ...form,
              firstName: e.target.value
            });
          }}
        />
      </label>
      <label>
        Last name:
        <input
          value={form.lastName}
          onChange={e => {
            setForm({
              ...form,
              lastName: e.target.value
            });
          }}
        />
      </label>
      <label>
        Email:
        <input
          value={form.email}
          onChange={e => {
            setForm({
              ...form,
              email: e.target.value
            });
          }}
        />
      </label>
      <p>
        {form.firstName}{' '}
        {form.lastName}{' '}
        ({form.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; }
```

</Sandpack>

<Solution />

### Form (嵌套对象) {/*form-nested-object*/}

In this example, the state is more nested. When you update nested state, you need to create a copy of the object you're updating, as well as any objects "containing" it on the way upwards. Read [updating a nested object](/learn/updating-objects-in-state#updating-a-nested-object) to learn more.

在这个例子中，state 是嵌套的对象。更新嵌套 state 时，需要创建要更新的对象的副本，以及任意它“包含”的对象的副本（二级对象）。请阅读[更新嵌套对象](/learn/updating-objects-in-state#updating-a-nested-object)了解更多。

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    setPerson({
      ...person,
      name: e.target.value
    });
  }

  function handleTitleChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        title: e.target.value
      }
    });
  }

  function handleCityChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        city: e.target.value
      }
    });
  }

  function handleImageChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        image: e.target.value
      }
    });
  }

  return (
    <>
      <label>
        Name:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Title:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        City:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Image:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' by '}
        {person.name}
        <br />
        (located in {person.artwork.city})
      </p>
      <img 
        src={person.artwork.image} 
        alt={person.artwork.title}
      />
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

<Solution />

### List (数组) {/*list-array*/}

In this example, the `todos` state variable holds an array. Each button handler calls `setTodos` with the next version of that array. The `[...todos]` spread syntax, `todos.map()` and `todos.filter()` ensure the state array is replaced rather than mutated.

在这个例子中，`todos` 状态变量保存着一个数组。每个按钮的处理程序使用该数组的下一个版本调用 `setTodos`。`[...todos]` 扩展语法，`todos.map()` 和 `todos.filter()` 确保状态数组被替换而不是改变。

<Sandpack>

```js App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(initialTodos);

  function handleAddTodo(title) {
    setTodos([
      ...todos,
      {
        id: nextId++,
        title: title,
        done: false
      }
    ]);
  }

  function handleChangeTodo(nextTodo) {
    setTodos(todos.map(t => {
      if (t.id === nextTodo.id) {
        return nextTodo;
      } else {
        return t;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    setTodos(
      todos.filter(t => t.id !== todoId)
    );
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

<Solution />

### 用 immer 编写简洁的更新逻辑 {/*writing-concise-update-logic-with-immer*/}

If updating arrays and objects without mutation feels tedious, you can use a library like [Immer](https://github.com/immerjs/use-immer) to reduce repetitive code. Immer lets you write concise code as if you were mutating objects, but under the hood it performs immutable updates:

如果在没有变化的前提下更新数组和对象感觉很乏味, 你可以使用像 [Immer](https://github.com/immerjs/use-immer) 这样的库来减少重复代码。 Immer 可以让你编写简洁的代码，就像你在正常（mutating）改变对象一样，但在底层，它执行（immutable）不变的更新：
<Sandpack>

```js
import { useState } from 'react';
import { useImmer } from 'use-immer';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [list, updateList] = useImmer(initialList);

  function handleToggle(artworkId, nextSeen) {
    updateList(draft => {
      const artwork = draft.find(a =>
        a.id === artworkId
      );
      artwork.seen = nextSeen;
    });
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={list}
        onToggle={handleToggle} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

<Solution />

</Recipes>

---

### 避免重新创建初始状态 {/*avoiding-recreating-the-initial-state*/}

React saves the initial state once and ignores it on the next renders.

React 只保存一次初始 state，但会在后续的渲染中忽略它。

```js
function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos());
  // ...
```

Although the result of `createInitialTodos()` is only used for the initial render, you're still calling this function on every render. This can be wasteful if it's creating large arrays or performing expensive calculations.

虽然 `createInitialTodos()` 的结果仅用于初始渲染，但你仍在每次渲染时调用此函数。如果创建大数组或执行耗费性能的计算，这可能是浪费。

To solve this, you may **pass it as an _initializer_ function** to `useState` instead:

解决这种情况，你可以**将初始函数传入 `useState`**，(即传入函数而非传入需要执行的函数)

```js
function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos);
  // ...
```

Notice that you’re passing `createInitialTodos`, which is the *function itself*, and not `createInitialTodos()`, which is the result of calling it. If you pass a function to `useState`, React will only call it during initialization.

请注意，你传递的是 `createInitialTodos`,这是*函数本身*，而不是`createInitialTodos()`,这是调用后的结果。如果你将函数传递给`usestate`, React 将只在初始化期间调用它。

React may [call your initializers twice](#my-initializer-or-updater-function-runs-twice) in development to verify that they are [pure](/learn/keeping-components-pure).

React 可能会在开发环境[调用两次初始化函数](#my-initializer-or-updater-function-runs-twice) 以验证是[纯函数组件](/learn/keeping-components-pure)。

<Recipes titleText="传递初始化函数和初始状态的区别" titleId="examples-initializer">

### 传递初始化函数 {/*passing-the-initializer-function*/}

This example passes the initializer function, so the `createInitialTodos` function only runs during initialization. It does not run when component re-renders, such as when you type into the input.

这个例子会传递初始化函数，所以 `createInitialTodos` 函数只在初始化期间运行。它不会在组件重新渲染时运行，例如在输入时。

<Sandpack>

```js
import { useState } from 'react';

function createInitialTodos() {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: 'Item ' + (i + 1)
    });
  }
  return initialTodos;
}

export default function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos);
  const [text, setText] = useState('');

  return (
    <>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        setTodos([{
          id: todos.length,
          text: text
        }, ...todos]);
      }}>Add</button>
      <ul>
        {todos.map(item => (
          <li key={item.id}>
            {item.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

<Solution />

### 直接传递初始状态 {/*passing-the-initial-state-directly*/}

This example **does not** pass the initializer function, so the `createInitialTodos` function runs on every render, such as when you type into the input. There is no observable difference in behavior, but this code is less efficient.

本例**没有**传递初始化函数，因此 `createInitialTodos` 函数在每次渲染时都运行，例如当你在 input 中输入时。行为上没有明显的区别，但是这段代码效率较低。

<Sandpack>

```js
import { useState } from 'react';

function createInitialTodos() {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: 'Item ' + (i + 1)
    });
  }
  return initialTodos;
}

export default function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos());
  const [text, setText] = useState('');

  return (
    <>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        setTodos([{
          id: todos.length,
          text: text
        }, ...todos]);
      }}>Add</button>
      <ul>
        {todos.map(item => (
          <li key={item.id}>
            {item.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

<Solution />

</Recipes>

---

### 用 key 重置 state {/*resetting-state-with-a-key*/}

Typically, you might encounter the `key` attribute when [rendering lists](/learn/rendering-lists). However, it also serves another purpose.

通常，在[渲染列表](/learn/rendering-lists)时，你可能会遇到 `key` 属性。然而，它还有另一个用途。

You can **reset a component's state by passing a different `key` to a component.** In this example, the Reset button changes the `version` state variable, which we pass as a `key` to the `Form`. When the `key` changes, React re-creates the `Form` component (and all of its children) from scratch, so its state gets reset.

你可以**通过向组件传入一个不同的 `key` 来重置组件的 state。**在这个例子中，Reset 按钮会重置 `version` 状态变量，我们将其作为 `key` 传递给 `Form`。当 `key` 改变时，React 会从头开始重新创建 `Form` 组件（及其所有子组件），以便重置其状态。

阅读[保存和重置状态](/learn/preserving-and-resetting-state)了解更多.

<Sandpack>

```js App.js
import { useState } from 'react';

export default function App() {
  const [version, setVersion] = useState(0);

  function handleReset() {
    setVersion(version + 1);
  }

  return (
    <>
      <button onClick={handleReset}>Reset</button>
      <Form key={version} />
    </>
  );
}

function Form() {
  const [name, setName] = useState('Taylor');

  return (
    <>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <p>Hello, {name}.</p>
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

---

### 储存以前渲染的信息 {/*storing-information-from-previous-renders*/}

Usually, you will update state in event handlers. However, in rare cases you might want to adjust state in response to rendering -- for example, you might want to change a state variable when a prop changes.

通常，你会在事件处理程序中更新 state。但是，在极少数情况下，你可能希望根据渲染来调整状态，例如，当属性改变时，你可能希望改变状态变量。

In most cases, you don't need this:

大多数情况下，你不需要这样做:

* **If the value you need can be computed entirely from the current props or other state, [remove that redundant state altogether](/learn/choosing-the-state-structure#avoid-redundant-state).** If you're worried about recomputing too often, the [`useMemo` Hook](/apis/usememo) can help.
* **如果你需要的值可以完全从当前 props 或其他 state 计算出来，[完全移除冗余 state](/learn/choosing-the-state-structure#avoid-redundant-state)。**如果你担心会频繁重新计算，那么 [`useMemo` Hook](/apis/usememo) 会对你有帮助。
* If you want to reset the entire component tree's state, [pass a different `key` to your component.](#resetting-state-with-a-key)
* 如果你想重置整个组件树，那么[传递不同的 `key` 给你的组件。](#resetting-state-with-a-key)
* If you can, update all the relevant state in the event handlers.
* 如果可以，更新事件处理程序中的所有相关 state。

In the rare case that none of these apply, there is a pattern you can use to update state based on the values that have been rendered so far, by calling a `set` function while your component is rendering.

在这些都不适用的罕见情况下，有一种模式可用于根据到目前为止已渲染的值更新 state，方法是在组件渲染时调用 `set` 函数。

Here's an example. This `CountLabel` component displays the `count` prop passed to it:

这里有一个例子，`CountLabel` 组件展示传递给它的 props `count`。

```js CountLabel.js
export default function CountLabel({ count }) {
  return <h1>{count}</h1>
}
```

Say you want to show whether the counter has *increased or decreased* since the last change. The `count` prop doesn't tell you this -- you need to keep track of its previous value. Add the `prevCount` state variable to track it. Add another state variable called `trend` to hold whether the count has increased or decreased. Compare `prevCount` with `count`, and if they're not equal, update both `prevCount` and `trend`. Now you can show both the current count prop and *how it has changed since the last render*.

假设你想显示自上次更改以来计数器是增加了还是减少了。`count` props 不会告诉你这一点——你需要跟踪它以前的值。添加 `prevCount` 状态变量以跟踪它。添加另一个名为 `trend` 的状态变量，以保存计数是增加还是减少。比较 `prevCount` 和 `count`，如果它们不相等，则同时更新 `prevCount` 和 `trend`。现在，你可以显示当前 count prop 和*自上次渲染以来的变化*。

<Sandpack>

```js App.js
import { useState } from 'react';
import CountLabel from './CountLabel.js';

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <button onClick={() => setCount(count - 1)}>
        Decrement
      </button>
      <CountLabel count={count} />
    </>
  );
}
```

```js CountLabel.js active
import { useState } from 'react';

export default function CountLabel({ count }) {
  const [prevCount, setPrevCount] = useState(count);
  const [trend, setTrend] = useState(null);
  if (prevCount !== count) {
    setPrevCount(count);
    setTrend(count > prevCount ? 'increasing' : 'decreasing');
  }
  return (
    <>
      <h1>{count}</h1>
      {trend && <p>The count is {trend}</p>}
    </>
  );
}
```

```css
button { margin-bottom: 10px; }
```

</Sandpack>

Note that if you call a `set` function while rendering, it must be inside a condition like `prevCount !== count`, and there must be a call like `setPrevCount(count)` inside of the condition. Otherwise, your component would re-render in a loop until it crashes. Also, you can only update the state of the *currently rendering* component like this. Calling the `set` function of *another* component during rendering is an error. Finally, your `set` call should still [update state without mutation](#updating-objects-and-arrays-in-state) -- this special case doesn't mean you can break other rules of [pure functions](/learn/keeping-components-pure).

请注意，如果你在渲染时调用 `set` 函数，它必须在 `prevCount !== count` 这样的条件中，并且必须在条件中有 `setPrevCount(count)` 这样的调用。否则，组件将在循环中重新呈现，直到崩溃，也就是会陷入死循环（渲染 -> 调用函数 -> 更新 -> 渲染）。此外，你只能像这样更新当前渲染组件的状态。在渲染期间调用另一个组件的 `set` 函数是错误的。最后，你的 `set` 调用仍然应该在不发生变化的情况下更新状态——这种特殊情况并不意味着你可以打破纯函数的其他规则。

This pattern can be hard to understand and is usually best avoided. However, it's better than updating state in an effect. When you call the `set` function during render, React will re-render that component immediately after your component exits with a `return` statement, and before rendering the children. This way, children don't need to render twice. The rest of your component function will still execute (and the result will be thrown away), but if your condition is below all the calls to Hooks, you may add `return null` inside it to restart rendering earlier.

下面这段没能理解哎~

这种模式很难理解，通常最好避免。但是，这比在 effect 中更新状态要好。当你在渲染过程中调用 `set` 函数时，React 会在你的组件使用 `return` 语句退出后，在渲染子组件之前，立即重新渲染该组件，这样子组件就不需要二次渲染了。组件函数的其余部分仍将执行(结果将被丢弃)，但如果你的条件低于对 Hooks 的所有调用，你可以在其中添加 `return null` 以提前重新开始渲染。

---

## 参考 {/*reference*/}

### `useState(initialState)` {/*usestate*/}

Call `useState` at the top level of your component to declare a [state variable](/learn/state-a-components-memory).

在组件的顶层调用 `useState` 来声明一个[状态变量](/learn/state-a-components-memory).

```js
import { useState } from 'react';

function MyComponent() {
  const [age, setAge] = useState(28);
  const [name, setName] = useState('Taylor');
  const [todos, setTodos] = useState(() => createTodos());
  // ...
```

The convention is to name state variables like `[something, setSomething]` using [array destructuring](/learn/a-javascript-refresher#array-destructuring).

惯例是使用[数组解构](/learn/a-javascript-refresher#array-destructuring)的形式命名状态变量，就像 `[something, setSomething]`。

[更多例子请看上述](#examples-basic)

#### 参数 {/*parameters*/}

* `initialState`: The value you want the state to be initially. It can be a value of any type, but there is a special behavior for functions. This argument is ignored after the initial render.
  * If you pass a function as `initialState`, it will be treated as an _initializer function_. It should be pure, should take no arguments, and should return a value of any type. React will call your initializer function when initializing the component, and store its return value as the initial state. [See an example above.](#avoiding-recreating-the-initial-state)

* `initialState`：state 的初始值。它可以是任意类型的值，但函数类型有一个特殊的行为。初始渲染后，这个参数将被忽略。
  * 如果将函数作为 `initialState` 传递，它将被视为*initializer function*。它应该是纯函数，不应该接受参数，并且应该返回任意类型的值。React 会在初始化组件时调用你的 initializer function，并将其返回值存储为初始 state。[见上面例子。](#avoiding-recreating-the-initial-state)

#### 返回值 {/*returns*/}

`useState` returns an array with exactly two values:

`useState` 返回正好包含两个值的数组：

1. The current state. During the first render, it will match the `initialState` you have passed.
2. The [`set` function](#setstate) that lets you update the state to a different value and trigger a re-render.


1. 当前状态。在第一次渲染时，它将与你传递的 `initialState` 相匹配。
2. [`set` 函数](#setstate)可以让你更新 state 为其他值，并且触发组件重新渲染。

#### 注意事项 {/*caveats*/}

* `useState` is a Hook, so you can only call it **at the top level of your component** or your own Hooks. You can't call it inside loops or conditions. If you need that, extract a new component and move the state into it.

* `useState` 是一个 Hook，所以只能在组件的顶层调用。你不能在循环或者条件中调用。如果你需要这样，那么提取一个新的组件，并将 state 移动到新组件里。

* In Strict Mode, React will **call your initializer function twice** in order to [help you find accidental impurities](#my-initializer-or-updater-function-runs-twice). This is development-only behavior and does not affect production. If your initializer function is pure (as it should be), this should not affect the logic of your component. The result from one of the calls will be ignored.

* 在严格模式下，React 会**调用两次 initializer function**，这是为了[帮助你发现意外情况](#my-initializer-or-updater-function-runs-twice)（可以理解为自带的语法检测）。这种行为只会出现在开发环境，并不会影响生产环境。如果 initializer function 是纯函数（它本就应该是纯函数），那么这不应该影响组件的逻辑。其中一次调用的结果会被忽略。

---

### `set` 函数, 比如 `setSomething(nextState)` {/*setstate*/}

The `set` function returned by `useState` lets you update the state to a different value and trigger a re-render. You can pass the next state directly, or a function that calculates it from the previous state:

`set` 函数是 `useState` 返回的，可以让你用不同的值更新 state 并触发重新渲染。你可以直接传入下一个 state 值，或者通过上一个 state 值计算它的函数。

```js
const [name, setName] = useState('Edward');

function handleClick() {
  setName('Taylor');
  setAge(a => a + 1);
  // ...
```

#### 参数 {/*setstate-parameters*/}

* `nextState`: The value that you want the state to be. It can be a value of any type, but there is a special behavior for functions.
  * If you pass a function as `nextState`, it will be treated as an _updater function_. It must be pure, should take the pending state as its only argument, and should return the next state. React will put your updater function in a queue and re-render your component. During the next render, React will calculate the next state by applying all of the queued updaters to the previous state. [See an example above.](#updating-state-based-on-the-previous-state)


* `nextState`：你想要给 state 设置的值。它可以是任意类型的值，但函数类型有一个特殊行为。
  * 如果你传入函数作为 `nextState`，它将被视为 *updater 函数*。它必须是纯函数，应该将 pending state 作为其唯一的参数，并且应该返回下一个 state。React 会将你的 updater 函数放入一个队列，并重新渲染组件。在下一次渲染时，React 通过将所有排队的 updater 函数应用到先前的 state 来计算下一个 state。[见上述例子](#updating-state-based-on-the-previous-state)

#### 返回值 {/*setstate-returns*/}

`set` functions do not have a return value.

`set` 函数没有返回值。

#### 注意事项 {/*setstate-caveats*/}

* The `set` function **only updates the state variable for the *next* render**. If you read the state variable after calling the `set` function, [you will still get the old value](#ive-updated-the-state-but-logging-gives-me-the-old-value) that was on the screen before your call.

* `set` 函数**只会在*下一次*渲染时更新状态变量**。如果你需要在调用 `set` 函数后读取状态变量，[你依然会获得调用前在屏幕上的旧值](#ive-updated-the-state-but-logging-gives-me-the-old-value)

* If the new value you provide is identical to the current `state`, as determined by an [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) comparison, React will **skip re-rendering the component and its children.** This is an optimization. Although in some cases React may still need to call your component before skipping the children, it shouldn't affect your code.

* 如果你提供的新值与当前的 `state` 相同，由 [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 比较决定，React 会**跳过重新渲染组件和子组件。**这是一种优化。虽然在某些情况下，React 可能仍然需要在跳过子组件之前调用组件，但它不应会影响你的代码。

* React [batches state updates](/learn/queueing-a-series-of-state-updates). It updates the screen **after all the event handlers have run** and have called their `set` functions. This prevents multiple re-renders during a single event. In the rare case that you need to force React to update the screen earlier, for example to access the DOM, you can use [`flushSync`](/apis/flushsync).

* React 会进行[批量的状态更新](/learn/queueing-a-series-of-state-updates)，它在**所有事件处理程序运行完毕**并调用了它们的 `set` 函数之后才会更新屏幕。这样可以防止在单个事件中多次重新渲染。在罕见的情况下，你需要强制 React 提前更新屏幕，例如访问DOM，你可以使用 [`flushSync`](/apis/flushsync)

* Calling the `set` function *during rendering* is only allowed from within the currently rendering component. React will discard its output and immediately attempt to render it again with the new state. This pattern is rarely needed, but you can use it to **store information from the previous renders**. [See an example above.](#storing-information-from-previous-renders)

* 仅允许在当前渲染组件内，在*渲染期间*调用 `set` 函数。React 将放丢弃它的输出，并立即尝试使用新状态再次渲染。这种模式很少需要，但你可以使用它来**存储来自上一次渲染的信息**。[见上述例子](#storing-information-from-previous-renders)

* In Strict Mode, React will **call your updater function twice** in order to [help you find accidental impurities](#my-initializer-or-updater-function-runs-twice). This is development-only behavior and does not affect production. If your updater function is pure (as it should be), this should not affect the logic of your component. The result from one of the calls will be ignored.

* 在严格模式，React 会**调用两次 updater 函数**，这是为了帮助你发现[意外情况](#my-initializer-or-updater-function-runs-twice)。这种行为只会在开发环境出现，并不会影响生产环境。如果你的 updater 函数时是纯函数（就应该是这样），这不会影响组件的逻辑。其中一次调用的结果将被忽略。

---

## 疑难解答 {/*troubleshooting*/}

### 我已经更新了 state，但是日志给我的是旧值 {/*ive-updated-the-state-but-logging-gives-me-the-old-value*/}

Calling the `set` function **does not change state in the running code**:

调用 `set` 函数**无法在正在运行的代码中改变 state**（也就是说 `set` 函数是异步的）：

```js {4,5,8}
function handleClick() {
  console.log(count);  // 0

  setCount(count + 1); // Request a re-render with 1
  console.log(count);  // Still 0!

  // 这里依然打印 0，是因为在这里会产生闭包
  setTimeout(() => {
    console.log(count); // Also 0!
  }, 5000);
}
```

This is because [states behaves like a snapshot](/learn/state-as-a-snapshot). Updating state requests another render with the new state value, but does not affect the `count` JavaScript variable in your already-running event handler.

这是因为 state 的行为类似于快照。更新 state 需要使用新的 state 值进行另一次渲染，但不会影响已经在运行的事件处理程序 中的 `count` 变量。(可以理解为旧的 state 依然是旧的，更新完成前或者说下次渲染前，新值并没有被应用到旧的 state 上。)

If you need to use the next state, you can save it in a variable before passing it to the `set` function:

如果你需要使用下一个状态，可以将其保存在一个变量中，然后再传递给 `set` 函数：

```js
const nextCount = count + 1;
setCount(nextCount);

console.log(count);     // 0
console.log(nextCount); // 1
```

---

### 我已经更新了 state，但是屏幕上还没有更新 {/*ive-updated-the-state-but-the-screen-doesnt-update*/}

React will **ignore your update if the next state is equal to the previous state,** as determined by an [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) comparison. This usually happens when you change an object or an array in state directly:

React 会**在下一个 state 于上一个 state 相等时忽略更新，**这是由 [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 比较后决定的。当你直接更改 state 中的对象或数组时，通常会发生这种情况：

```js
obj.x = 10;  // 🚩 Wrong: 改变现有对象
setObj(obj); // 🚩 Doesn't do anything
```

You mutated an existing `obj` object and passed it back to `setObj`, so React ignored the update. To fix this, you need to ensure that you're always [_replacing_ objects and arrays in state instead of _mutating_ them](#updating-objects-and-arrays-in-state):

你改变了现有的 `obj` 并且将它回传给 `setObj`，所以 React 会忽略更新。要解决这个问题，你需要确保总是[*替换*对象和数组，而不是*改变*他们](#updating-objects-and-arrays-in-state)：

```js
// ✅ Correct: creating a new object
setObj({
  ...obj,
  x: 10
});
```

---

### 我得到一个错误: “Too many re-renders” {/*im-getting-an-error-too-many-re-renders*/}

You might get an error that says: `Too many re-renders. React limits the number of renders to prevent an infinite loop.` Typically, this means that you're unconditionally setting state *during render*, so your component enters a loop: render, set state (which causes a render), render, set state (which causes a render), and so on. Very often, this is caused by a mistake in specifying an event handler:

你可能会得到一个错误：`Too many re-renders. React limits the number of renders to prevent an infinite loop.` 通常，这意味着在*渲染期间* 无条件地设置 state，因此组件进入循环：渲染、设置状态（导致渲染）、渲染、设置状态（导致渲染）等等。通常，这是由于指定事件处理程序时出错造成的：

```js {1-2}
// 🚩 Wrong: calls the handler during render
return <button onClick={handleClick()}>Click me</button>

// ✅ Correct: passes down the event handler
return <button onClick={handleClick}>Click me</button>

// ✅ Correct: passes down an inline function
return <button onClick={(e) => handleClick(e)}>Click me</button>
```

If you can't find the cause of this error, click on the arrow next to the error in the console and look through the JavaScript stack to find the specific `set` function call responsible for the error.

如果找不到该错误的原因，请单击控制台中错误旁边的箭头，查看 JavaScript 堆栈，找到导致该错误的特定 `set` 函数调用。

---

### 我的初始化函数或 updater 函数运行了两次 {/*my-initializer-or-updater-function-runs-twice*/}

In [Strict Mode](/apis/strictmode), React will call some of your functions twice instead of once:

在[严格模式](/apis/strictmode)下，React 将调用某些函数两次：

```js {2,5-6,11-12}
function TodoList() {
  // This component function will run twice for every render.

  const [todos, setTodos] = useState(() => {
    // This initializer function will run twice during initialization.
    return createTodos();
  });

  function handleClick() {
    setTodos(prevTodos => {
      // This updater function will run twice for every click.
      return [...prevTodos, createTodo()];
    });
  }
  // ...
```

This is expected and shouldn't break your code.

这是意料之中的，不应该破坏你的代码。

This **development-only** behavior helps you [keep components pure](/learn/keeping-components-pure). React uses the result of one of the calls, and ignores the result of the other call. As long as your component, initializer, and updater functions are pure, this shouldn't affect your logic. However, if they are accidentally impure, this helps you notice the mistakes and fix it.

这个**仅限开发环境**的行为有助于[保持纯函数组件](/learn/keep-components-pure)。React 使用其中一个调用的结果，而忽略另一个调用的结果。只要组件、初始值函数和 update 函数是纯函数，这就不会影响逻辑。然而，如果它们是意外的非纯函数，这有助于你注意到错误并修复它。

For example, this impure updater function mutates an array in state:

例如，这个不纯的 updater 函数会使数组在以下状态下发生改变：

```js {2,3}
setTodos(prevTodos => {
  // 🚩 Mistake: mutating state
  prevTodos.push(createTodo());
});
```

Because React calls your updater function twice, you'll see the todo was added twice, so you'll know that there is a mistake. In this example, you can fix the mistake by [replacing the array instead of mutating it](#updating-objects-and-arrays-in-state):

因为 React 调用了 updater 函数两次，你会看到 todo 被添加了两次，所以你会知道这是一个错误。在本例中，你可以通过[替换数组而不是改变他们](#updating-objects-and-arrays-in-state)来修复错误：

```js {2,3}
setTodos(prevTodos => {
  // ✅ Correct: replacing with new state
  return [...prevTodos, createTodo()];
});
```

Now that this updater function is pure, calling it an extra time doesn't make a difference in behavior. This is why React calling it twice helps you find mistakes. **Only component, initializer, and updater functions need to be pure.** Event handlers don't need to be pure, so React will never call your event handlers twice.

既然这个 updater 函数是纯函数，调用它额外的时间并不会对行为产生影响。这就是为什么 React 两次调用它可以帮助你发现错误**只有组件、初始值设定项和更新程序函数需要是纯函数。**事件处理程序不需要是纯函数，所以 React 永远不会调用两次你的事件处理程序。

阅读 [保持纯组件](/learn/keeping-components-pure)来学习更多。

---

### 我试图将函数设置为 state，但它却被调用了 {/*im-trying-to-set-state-to-a-function-but-it-gets-called-instead*/}

You can't put a function into state like this:

不能将函数像这样设置到 state：

```js
const [fn, setFn] = useState(someFunction);

function handleClick() {
  setFn(someOtherFunction);
}
```

Because you're passing a function, React assumes that `someFunction` is an [initializer function](#avoiding-recreating-the-initial-state), and that `someOtherFunction` is an [updater function](#updating-state-based-on-the-previous-state), so it tries to call them and store the result. To actually *store* a function, you have to put `() =>` before them in both cases. Then React will store the functions you pass.

因为你在传递一个函数，React 假设 `someFunction` 是一个[初始化函数](#avoiding-recreating-the-initial-state)，而 `someOtherFunction` 是一个 [updater 函数](#updating-state-based-on-the-previous-state)，所以它尝试调用它们并保存结果。为了实际保存一个函数，在这两种情况下都必须在它们前面加上 `()=>`。然后 `React` 会保存你传递的函数。

```js {1,4}
const [fn, setFn] = useState(() => someFunction);

function handleClick() {
  setFn(() => someOtherFunction);
}
```