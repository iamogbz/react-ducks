# React Ducks

[![NPM badge](https://img.shields.io/npm/v/react-ducks)](https://www.npmjs.com/package/react-ducks)
[![Dependabot badge](https://badgen.net/dependabot/iamogbz/react-ducks/?icon=dependabot)](https://app.dependabot.com)
[![Dependencies](https://david-dm.org/iamogbz/react-ducks.svg)](https://github.com/iamogbz/react-ducks)
[![Build Status](https://github.com/iamogbz/react-ducks/workflows/Build/badge.svg)](https://github.com/iamogbz/react-ducks/actions)
[![Coverage Status](https://coveralls.io/repos/github/iamogbz/react-ducks/badge.svg?branch=master)](https://coveralls.io/github/iamogbz/react-ducks?branch=master)

Implement ducks in React following the redux pattern but using React Context.

Uses [`immer`][immer-intro] to wrap reducers when creating, ensuring atomic state mutations.

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

**Note**: This adds selectors to the duck created with the default selector to get the state exported under `$`.

```js
counterDuck.selectors.$(state);
// this is equivalent to (counterState) => counterState
```

Create the root/global duck as a combination of all other ducks.

```js
// duck/index.js
export default createRootDuck(counterDuck, otherDuck);
```

**Note**: This wraps any selectors exported from the ducks inorder to get the state from the correct paths.

```js
rootDuck.selectors.counter.$(state);
// this is equivalent to (rootState) => rootState[counterDuck.name]
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
  const count = rootDuck.selectors.counter.$(state);
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
  const count = useSelector(rootDuck.selectors.counter.$, Context);
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
        Count: <span>{rootDuck.selectors.counter.$(state)}</span>
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

```js
// index.jsx
const rootElement = document.getElementById("root");
ReactDOM.render(
  <Provider Context={Context}>
    <App />
...
```

A side benefit to scoping the context state to the provider is allowing multiple entire apps to be run concurrently.

### applyMiddleware(...middlewares)

This takes a variable list of middlewares to be applied.

#### Example: Custom Logger Middleware

```js
// context.js
function logger({ getState }) {
  // Recommend making the returned dispatch method asynchronous.
  return (next) => async (action) => {
    console.log("will dispatch", action);
    // Call the next dispatch method in the middleware chain.
    const returnValue = await next(action);
    // Resolving the result of the next dispatch allows the referenced
    // state to be updated by `React.useReducer` and available to get.
    console.log("state after dispatch", getState());
    // This will likely be the action itself, unless
    // a middleware further in chain changed it.
    return returnValue;
  };
}

export default createContext(..., applyMiddleware(logger));
```

See [redux applyMiddleware][redux-applymiddleware] for more documentation.

### createConnect(Context?)

This a helper creates a function that can be used to smartly connect a component to your context value.

```js
// connect.js
export default connect = createConnect(Context);
```

**Note**: if the `Context` argument is not supplied, the `GlobalContext` is used.

**Note**: `createConnect` is just a helper and can be replaced with a direct import and use of `connect`.

#### Example Usage

```jsx
// app.jsx
function App(props) {
  return (
    <div>
      Count: <span>{props.count}</span>
      <button onClick={props.increment} />
    </div>
  );
}

export default connect(
  createStructuredSelector({ count: rootDuck.selectors.counter.$ }),
  counterDuck.actions
)(App);
```

See [redux connect][react-redux-connect] for more options.

## Demo

As a proof of concept see the converted sandbox app from the react-redux basic tutorial below.

- With redux [example][react-redux-tutorial]
- Without redux [code][react-ducks-no-redux]

[immer-intro]: https://medium.com/hackernoon/introducing-immer-immutability-the-easy-way-9d73d8f71cb3
[proposal-observable]: https://github.com/tc39/proposal-observable
[react-ducks-no-redux]: https://codesandbox.io/s/todo-app-without-redux-9yc57
[react-redux-connect]: https://react-redux.js.org/api/connect
[react-redux-tutorial]: https://react-redux.js.org/introduction/basic-tutorial
[redux-applymiddleware]: https://redux.js.org/api/applymiddleware#applymiddlewaremiddleware
