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

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createMocks() {
    const dummyMiddleware: Middleware<
        Record<string, unknown>,
        string,
        unknown
    > = () => (next) => (action): Promise<typeof action> => next(action);

    const DECREMENT = "decrement";
    const INCREMENT = "increment";
    const decrement = (state: number): number => state - 1;
    const increment = jest.fn((state): number => state + 1);
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
        name: "counter",
        initialState: 0,
        reducers: { [DECREMENT]: counterReducer, [INCREMENT]: counterReducer },
        selectors: { get: (state): number => state },
    });

    const INIT = "init";
    const init = jest.fn((): boolean => true);
    const initDuck = createDuck({
        name: "init",
        initialState: false,
        reducers: { [INIT]: init },
        selectors: { get: (state): boolean => state },
        actionMapping: { [ActionTypes.INIT]: INIT },
    });

    const dummyDuck = createDuck({
        name: "dummy",
        initialState: null,
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

    function Example(): React.ReactElement {
        const increment = useDispatch(counterDuck.actions.increment);
        const init = useSelector(rootDuck.selectors.init?.get);
        const count = useSelector(rootDuck.selectors.counter?.get, Context);
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
    }) => (next) => async (action): Promise<typeof action> => {
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
        return () => async (action): Promise<typeof action> => action;
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
