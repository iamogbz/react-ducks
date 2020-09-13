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
  actionMapping: { otherActionType: "increment" },
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
export default createContext(
  rootDuck.reducer,
  rootDuck.initialState,
  "ContextName",
  enhancer,
  useAsGlobalContext
);
```

**Note**: The `enhancer` may be optionally specified to enhance the context with third-party capabilities such as middleware, time travel, persistence, etc. The only context enhancer that ships with Ducks is [applyMiddleware](#applyMiddlewaremiddlewares).

**Note**: The `useAsGlobalContext` i.e. `global` option; allows for setting a default context that is used by the [`useDispatch`](#useDispatchactionCreatorContext) and [`useSelector`](#useSelectorselectorContext) hooks when no `Context` is supplied. This is useful when creating the context that will be used with the root provider.

Use the state and actions in your component.

```jsx
// app.jsx
export default function App(props) {
  const { state, dispatch } = React.useContext(Context);
  const count = state[counterDuck.name];
  const increment = React.useCallback(
    () => dispatch(counterDuck.actions.increment()),
    [dispatch]
  );
  return (
    <div>
      Count: <span>{count}</span>
      <button onClick={increment} />
    </div>
  );
}
```

**Note**: The use of `React.useContext` can be replaced with a combination of [`useDispatch`](#useDispatchactionCreatorContext) and [`useSelector`](#useSelectorselectorContext) hooks.

```jsx
// app.jsx
...
  const count = useSelector(state => state[counterDuck.name], Context);
  const increment = useDispatch(counterDuck.actions.increment, Context);
...
```

**Note**: This is equivalent to the class component described below.

```jsx
// app.jsx
export default class App extends React.PureComponent {
  static contextType = Context;

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
  };
}
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
  rootElement
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

A side benefit to scoping the context state to the provider is allowing multiple entire apps to be run concurrently.

### applyMiddleware(...middlewares)

This takes a variable list of middlewares to be applied

#### Example: Custom Logger Middleware

```js
// context.js
function logger({ getState }) {
  return (next) => (action) => {
    console.log("will dispatch", action);
    // Call the next dispatch method in the middleware chain.
    const returnValue = next(action);
    Promise.resolve().then(() => {
      // The state is updated by `React.useReducer` in the next tick
      console.log("state after dispatch", getState());
    });
    // This will likely be the action itself, unless
    // a middleware further in chain changed it.
    return returnValue;
  };
}

export default createContext(..., applyMiddleware(logger));
```

See [redux applyMiddleware][redux-applymiddleware] for more documentation.

## Example

As a proof of concept converted the sandbox app from the react-redux basic tutorial

- With redux [example][react-redux-tutorial]
- Without redux [code][react-duck-no-redux]

## Next

- Implement observable pattern for context value, [reference][proposal-observable]

## Suggestions

- Use `immer` to create immutable reducers, [see guide][immer-intro].

[immer-intro]: https://medium.com/hackernoon/introducing-immer-immutability-the-easy-way-9d73d8f71cb3
[proposal-observable]: https://github.com/tc39/proposal-observable
[react-duck-no-redux]: https://codesandbox.io/s/todo-app-without-redux-9yc57
[react-redux-tutorial]: https://react-redux.js.org/introduction/basic-tutorial
[redux-applymiddleware]: https://redux.js.org/api/applymiddleware#applymiddlewaremiddleware
