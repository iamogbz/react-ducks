import * as React from "react";
import {
    applyMiddleware,
    createContext,
    createDuck,
    createRootDuck,
    createRootProvider,
} from "src";
import { ActionTypes } from "src/utils/actionTypes";

export function createMocks(): {
    EnhancedContext: Context<Record<string, unknown>>;
    Example: React.FunctionComponent;
    RootProvider: React.FunctionComponent;
    increment: jest.MockedFunction<(s: number) => number>;
    init: jest.MockedFunction<() => boolean>;
} {
    const increment = jest.fn((state: number): number => state + 1);
    const decrement = (state: number): number => state - 1;
    const counterDuck = createDuck({
        name: "counter",
        initialState: 0,
        reducers: { decrement, increment },
    });

    const init = jest.fn((): boolean => true);
    const initDuck = createDuck({
        name: "init",
        initialState: false,
        reducers: { init },
        actionMapping: { [ActionTypes.INIT]: "init" },
    });

    const rootDuck = createRootDuck(counterDuck, initDuck);

    const Context = createContext(rootDuck.reducer, rootDuck.initialState);

    const RootProvider = createRootProvider(Context);

    function Example(): React.ReactElement {
        const { dispatch, state } = React.useContext(Context);
        const increment = React.useCallback(() => {
            dispatch(counterDuck.actions.increment());
        }, [dispatch]);
        return (
            <div>
                Count: <span>{state[counterDuck.name]}</span>
                <button disabled={!state[initDuck.name]} onClick={increment}>
                    increment
                </button>
            </div>
        );
    }

    const logger: Middleware<Record<string, unknown>, string, unknown> = () => (
        next,
    ) => (action): typeof action => {
        // eslint-disable-next-line no-console
        console.log("will dispatch", action);
        // Call the next dispatch method in the middleware chain.
        const returnValue = next(action);
        // eslint-disable-next-line no-console
        console.log("will return", returnValue);
        // This will likely be the action itself, unless
        // a middleware further in chain changed it.
        return returnValue;
    };
    const EnhancedContext = createContext(
        rootDuck.reducer,
        rootDuck.initialState,
        "EnhancedContext",
        applyMiddleware(logger),
    );

    return {
        EnhancedContext,
        Example,
        RootProvider,
        increment,
        init,
    };
}
