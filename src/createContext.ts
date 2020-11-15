import * as React from "react";
import "./utils/polyfillSymbol";
import { setGlobalContext } from "./components/Context";

function createUnimplemented(objectName: string): (m: string) => () => never {
    return function createUnimplemented(methodName) {
        return function unimplemented() {
            throw new Error(`Unimplemented method:${objectName}.${methodName}`);
        };
    };
}

export function createContextWithValue<State, T extends Action>(
    value: RequiredKeys<
        ContextValue<State, T>,
        "reducer" | "state" | "subscribe"
    >,
): Context<State, T> {
    return React.createContext({
        dispatch: async (a) => a,
        getState: () => value.state,
        ...value,
    });
}

export function createContext<State, T extends Action>(
    rootReducer: Reducer<State, T>,
    preloadedState: State,
    enhancer?: ContextEnhance<State, T>,
    displayName?: string,
    global = false,
): Context<State, T> {
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
