import * as React from "react";
import {
    applyMiddleware,
    createContext,
    createDuck,
    createRootDuck,
    createRootProvider,
} from "src";
import { useSelector } from "src/hooks/useSelector";
import { ActionTypes } from "src/utils/actionTypes";

export function createMocks(): {
    EnhancedContext: Context<Record<string, unknown>>;
    Example: React.FunctionComponent;
    RootProvider: React.FunctionComponent;
    increment: jest.MockedFunction<(s: number) => number>;
    init: jest.MockedFunction<() => boolean>;
} {
    const increment = jest.fn((state): number => state + 1);
    const decrement = (state: number): number => state - 1;
    const counterDuck = createDuck({
        name: "counter",
        initialState: 0,
        reducers: { decrement, increment },
        selectors: { get: (state): number => state },
    });

    const init = jest.fn((): boolean => true);
    const initDuck = createDuck({
        name: "init",
        initialState: false,
        reducers: { init },
        selectors: { get: (state): boolean => state },
        actionMapping: { [ActionTypes.INIT]: "init" },
    });

    const rootDuck = createRootDuck(counterDuck, initDuck);

    const Context = createContext(
        rootDuck.reducer,
        rootDuck.initialState,
        undefined,
        "GlobalContext",
        true,
    );

    const RootProvider = createRootProvider(Context);

    function Example(): React.ReactElement {
        const { dispatch } = React.useContext(Context);
        const increment = React.useCallback(() => {
            dispatch(counterDuck.actions.increment());
        }, [dispatch]);
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
    }) => (next) => (action): typeof action => {
        // eslint-disable-next-line no-console
        console.log("action to dispatch", action);
        // Call the next dispatch method in the middleware chain.
        const returnValue = next(action);
        Promise.resolve().then(() => {
            // eslint-disable-next-line no-console
            console.log("state after dispatch", getState());
        });
        // This will likely be the action itself, unless
        // a middleware further in chain changed it.
        return returnValue;
    };
    const EnhancedContext = createContext(
        rootDuck.reducer,
        rootDuck.initialState,
        applyMiddleware(logger),
        "EnhancedContext",
    );

    return {
        EnhancedContext,
        Example,
        RootProvider,
        increment,
        init,
    };
}
