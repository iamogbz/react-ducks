import * as React from "react";
import {
    applyMiddleware,
    createContext,
    createDuck,
    createRootDuck,
    createRootProvider,
    useDispatch,
    useSelector,
} from "src";
import { ActionTypes } from "src/utils/actionTypes";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function createMocks() {
    const dummyMiddleware: Middleware<
        Record<string, unknown>,
        string,
        unknown
    > = () => (next) => (action) => next(action);

    const DECREMENT = "decrement";
    const INCREMENT = "increment";
    const decrement = (state: number) => state - 1;
    const increment = jest.fn((state: number) => state + 1);
    const counterReducer: (s: number, a?: Action<string>) => number = (
        state,
        action,
    ) => {
        switch (action?.type) {
            case DECREMENT:
                return decrement(state);
            case INCREMENT:
                return increment(state);
            default:
                return state;
        }
    };
    const counterDuck = createDuck({
        initialState: 0,
        name: "counter",
        reducers: { [DECREMENT]: counterReducer, [INCREMENT]: counterReducer },
        selectors: { get: (s) => s },
    });

    const INIT = "init";
    const init = jest.fn(() => true);
    const initDuck = createDuck({
        actionMapping: { [ActionTypes.INIT]: INIT },
        initialState: false,
        name: "init",
        reducers: { [INIT]: init },
    });

    const dummyDuck = createDuck({
        initialState: null,
        name: "dummy",
        reducers: {},
    });

    const rootDuck = createRootDuck(counterDuck, initDuck, dummyDuck);

    const Context = createContext(
        rootDuck.reducer,
        rootDuck.initialState,
        applyMiddleware(dummyMiddleware),
        "GlobalContext",
        true,
    );

    const RootProvider = createRootProvider(Context);

    function Example() {
        const increment = useDispatch(counterDuck.actions.increment);
        const init = useSelector(rootDuck.selectors.init?.$, Context);
        const count = useSelector(counterDuck.selectors?.get);
        return (
            <div>
                Count: <span>{count}</span>
                <button disabled={!init} onClick={increment}>
                    increment
                </button>
            </div>
        );
    }

    const logger: Middleware<Record<string, unknown>, string, unknown> = ({
        getState,
    }) => (next) => async (action) => {
        // eslint-disable-next-line no-console
        console.log("action to dispatch", action);
        // Call the next dispatch method in the middleware chain.
        const returnValue = await next(action);
        // eslint-disable-next-line no-console
        console.log("state after dispatch", getState());
        // This will likely be the action itself, unless
        // a middleware further in chain changed it.
        return returnValue;
    };
    const EnhancedContext = createContext(
        rootDuck.reducer,
        rootDuck.initialState,
        applyMiddleware(dummyMiddleware, logger),
        "EnhancedContext",
    );

    const badMiddleware: Middleware<
        Record<string, unknown>,
        string,
        unknown
    > = ({ dispatch }) => {
        dispatch({ type: "SOME_ACTION" });
        return () => async (action) => action;
    };
    const emptyRootDuck = createRootDuck();
    const ErrorContext = createContext(
        emptyRootDuck.reducer,
        emptyRootDuck.initialState,
        applyMiddleware(dummyMiddleware, badMiddleware),
        "ErrorContext",
    );

    return {
        EnhancedContext,
        ErrorContext,
        Example,
        RootProvider,
        increment,
        init,
        rootDuck,
    };
}
