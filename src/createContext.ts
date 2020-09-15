import * as React from "react";
import { SymbolObservable } from "./utils/symbolObservable";
import { setGlobalContext } from "./components/Context";

function createUnimplemented(objectName?: string): (m: string) => () => never {
    const prefix = objectName ? `${objectName}.` : "";
    return function createUnimplemented(methodName) {
        return function unimplemented(): never {
            throw new Error(`Unimplemented method: ${prefix}${methodName}`);
        };
    };
}

export function createContextWithValue<S, T extends string, P>(
    value: Partial<ContextValue<S, T, P>>,
): Context<S, T, P> {
    return React.createContext<ContextValue<S, T, P>>({
        dispatch: (a) => a,
        getState: () => value.state,
        reducer: (s) => s,
        ...value,
    } as ContextValue<S, T, P>);
}

export function createContext<S, T extends string, P>(
    rootReducer: Reducer<S, T, P>,
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
        [SymbolObservable]: unimplemented(SymbolObservable.toString()),
    });
    if (displayName) {
        Context.displayName = displayName;
    }
    if (global) {
        setGlobalContext(Context);
    }
    return Context;
}
