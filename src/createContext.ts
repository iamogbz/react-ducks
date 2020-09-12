import * as React from "react";
import { SymbolObservable } from "./utils/symbolObservable";

function createUnimplemented(objectName?: string): (m: string) => () => never {
    const prefix = objectName ? `${objectName}.` : "";
    return function unimplemented(methodName) {
        return (): never => {
            throw new Error(`Unimplemented method: ${prefix}${methodName}`);
        };
    };
}

export function createContext<S, T extends string, P>(
    rootReducer: Reducer<S, T, P>,
    preloadedState: S,
    enhancer?: ContextEnhance<S, T, P>,
    displayName?: string,
): Context<S, T, P> {
    const unimplemented = createUnimplemented(`Context(${displayName ?? ""})`);
    const Context = React.createContext<ContextValue<S, T, P>>({
        dispatch: (a) => a,
        enhancer,
        getState: () => preloadedState,
        reducer: rootReducer,
        state: preloadedState,
        [SymbolObservable]: unimplemented(SymbolObservable.toString()),
    });
    if (displayName) {
        Context.displayName = displayName;
    }
    return Context;
}
