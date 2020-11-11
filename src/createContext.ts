import * as React from "react";
import "./utils/polyfillSymbol";
import { setGlobalContext } from "./components/Context";

function createUnimplemented(objectName?: string): (m: string) => () => never {
    const prefix = objectName ? `${objectName}.` : "";
    return function createUnimplemented(methodName) {
        return function unimplemented() {
            throw new Error(`Unimplemented method: ${prefix}${methodName}`);
        };
    };
}

export function createContextWithValue<S, T extends string, P>(
    value: Include<ContextValue<S, T, P>, "reducer" | "state" | "subscribe">,
): Context<S, T, P> {
    return React.createContext<ContextValue<S, T, P>>({
        dispatch: async (a) => a,
        getState: () => value.state,
        ...value,
    });
}

export function createContext<S, T extends string, P>(
    rootReducer: Reducer<S, Record<T, P>>,
    preloadedState: S,
    enhancer?: ContextEnhance<S, T, P>,
    displayName?: string,
    global = false,
): Context<S, T, P> {
    const unimplemented = createUnimplemented(`Context(${displayName ?? ""})`);
    const Context = createContextWithValue({
        enhancer,
        reducer: rootReducer,
        state: preloadedState,
        subscribe: unimplemented("subscribe"),
    });
    if (displayName) {
        Context.displayName = displayName;
    }
    if (global) {
        setGlobalContext(Context);
    }
    return Context;
}
