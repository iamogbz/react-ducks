import * as React from "react";
import "./utils/polyfillSymbol";
import { setGlobalContext } from "./components/Context";

export function createContextWithValue<S, T extends string, P>(
    value: Include<ContextValue<S, T, P>, "reducer" | "state">,
): Context<S, T, P> {
    return React.createContext<ContextValue<S, T, P>>({
        dispatch: async (a) => a,
        getState: () => value.state,
        subscribe: () => ({ closed: true, unsubscribe: () => undefined }),
        ...value,
    });
}

export function createContext<S, T extends string, P>(
    rootReducer: Reducer<S, T, P>,
    preloadedState: S,
    enhancer?: ContextEnhance<S, T, P>,
    displayName?: string,
    global = false,
): Context<S, T, P> {
    const Context = createContextWithValue({
        enhancer,
        reducer: rootReducer,
        state: preloadedState,
    });
    if (displayName) {
        Context.displayName = displayName;
    }
    if (global) {
        setGlobalContext(Context);
    }
    return Context;
}
