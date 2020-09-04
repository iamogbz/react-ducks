import * as React from "react";
import { SymbolObservable } from "./utils/symbolObservable";

const idFn = <A>(a: A): A => a;

function createUnimplemented(objectName?: string) {
    return function unimplemented(methodName: string): () => never {
        const prefix = objectName ? `${objectName}.` : "";
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return (...args: unknown[]): never => {
            throw new Error(`Unimplemented method: ${prefix}${methodName}`);
        };
    };
}

export function createContext<State>(
    rootReducer: Reducer<State>,
    preloadedState: State,
    displayName?: string,
): Context<State> {
    const unimplemented = createUnimplemented(`Context(${displayName ?? ""})`);
    const Context = React.createContext<ContextValue<State>>({
        dispatch: idFn,
        reducer: rootReducer,
        state: preloadedState,
        [SymbolObservable]: unimplemented(SymbolObservable.toString()),
    });
    if (displayName) {
        Context.displayName = displayName;
    }
    return Context;
}
