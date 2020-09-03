# React Duck

[![Dependabot badge](https://badgen.net/dependabot/iamogbz/react-duck/?icon=dependabot)](https://app.dependabot.com)
[![Dependencies](https://david-dm.org/iamogbz/react-duck.svg)](https://github.com/iamogbz/react-duck)
[![Build Status](https://github.com/iamogbz/react-duck/workflows/Build/badge.svg)](https://github.com/iamogbz/react-duck/actions)
[![Coverage Status](https://coveralls.io/repos/github/iamogbz/react-duck/badge.svg?branch=master)](https://coveralls.io/github/iamogbz/react-duck?branch=master)

Implement ducks in react following the redux pattern but using React Context.

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

Create the root reducer from all the duck reducers.

```js
// reducer.js
export default createRootReducer(counterDuck, otherDuck);
```

Create the global context.

```js
// context.js
export default createContext(rootReducer, preloadedState);
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
