# React Duck

[![NPM badge](https://img.shields.io/npm/v/react-duck)](https://www.npmjs.com/package/react-duck)
[![Dependabot badge](https://badgen.net/dependabot/iamogbz/react-duck/?icon=dependabot)](https://app.dependabot.com)
[![Dependencies](https://david-dm.org/iamogbz/react-duck.svg)](https://github.com/iamogbz/react-duck)
[![Build Status](https://github.com/iamogbz/react-duck/workflows/Build/badge.svg)](https://github.com/iamogbz/react-duck/actions)
[![Coverage Status](https://coveralls.io/repos/github/iamogbz/react-duck/badge.svg?branch=master)](https://coveralls.io/github/iamogbz/react-duck?branch=master)

Implement ducks in React following the redux pattern but using React Context.

## Usage

Create the ducks for each slice of application logic.

```js
// duck/counter.js
export default createDuck({
    name: "counter",
    initialState: 0,
    reducers: {
        increment: (state) => state + 1,
    },
});
```

Create the root/global duck as a combination of all other ducks.

```js
// duck/index.js
export default createRootDuck(counterDuck, otherDuck);
```

Create the global context.

```js
// context.js
export default createContext(rootDuck.reducer, rootDuck.initialState);
```

Use the state and actions in your component.

```jsx
// app.jsx
export default function App(props) {
    const { state, dispatch } = React.useContext(Context);
    const increment = React.useCallback(
        () => dispatch(counterDuck.actions.increment()),
        [dispatch],
    );
    return (
        <div>
            Count: <span>{state[counterDuck.name]}</span>
            <button onClick={increment} />
        </div>
    );
}
```

**Note**: this is equivalent to the class component described below.

```jsx
// app.jsx
export default class App extends React.PureComponent {
    render() {
        const { state } = this.context;
        return (
            <div>
                Count: <span>{state[counterDuck.name]}</span>
                <button onClick={this.increment} />
            </div>
        );
    }

    increment = () => {
        this.context.dispatch(counterDuck.actions.increment());
    }
}
App.contextType = Context;
```

Wrap the application in the root provider to handle state changes.

```js
// index.jsx
const rootElement = document.getElementById("root");
const Provider = createRootProvider(Context);
ReactDOM.render(
    <Provider>
        <App />
    </Provider>,
    rootElement,
);
```

**Note**: `createRootProvider` is just a helper and can be replaced, with the functional difference highlighted below.

```git
diff --git a/index.jsx b/index.jsx
index 0a0a0a0..1b1b1b1 100644
--- a/index.jsx
+++ b/index.jsx
const rootElement = document.getElementById("root");
-const Provider = createRootProvider(Context);
 ReactDOM.render(
-    <Provider>
+    <Provider Context={Context}>
         <App />
```

## Example

As a proof of concept converted the sandbox app from the react-redux basic tutorial

- With redux [example][react-redux-tutorial]
- Without redux [code][react-duck-no-redux]

## Next

- Implement slice selectors and `useSelector` hook, [reference][react-redux-useselector]
- Implement asynchronous middleware context support, [reference][redux-applymiddleware]

## Suggestions

- Use `immer` to create immutable reducers, [see guide][immer-intro].

[react-redux-tutorial]: https://react-redux.js.org/introduction/basic-tutorial
[react-duck-no-redux]: https://codesandbox.io/s/todo-app-without-redux-9yc57
[react-redux-useselector]: https://react-redux.js.org/api/hooks#useselector
[redux-applymiddleware]: https://redux.js.org/api/applymiddleware#applymiddlewaremiddleware
[immer-intro]: https://medium.com/hackernoon/introducing-immer-immutability-the-easy-way-9d73d8f71cb3
