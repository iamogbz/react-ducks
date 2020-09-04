import * as React from "react";
import { SymbolObservable } from "./utils/symbolObservable";

function createUnimplemented(methodName: string): () => never {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return (...args: unknown[]): never => {
        throw new Error(`Unimplemented method: ${methodName}`);
    };
}

export function createContext<State>(
    rootReducer: Reducer<State>,
    preloadedState: State,
    displayName?: string,
): Context<State> {
    const context = `Context(${displayName ?? ""}).of`;
    const Context = React.createContext<ContextValue<State>>({
        dispatch: (a) => a,
        from: createUnimplemented(`${context}.from`),
        of: createUnimplemented(`${context}.of`),
        reducer: rootReducer,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        replaceReducer: <NewState>(r: Reducer<NewState>): Context<NewState> =>
            createUnimplemented(`${context}.replaceReducer`)(),
        state: preloadedState,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        subscribe: (o: Observer) => ({
            unsubscribe: (): void => undefined,
            closed: true,
        }),
        [SymbolObservable]: () => undefined,
    });
    if (displayName) {
        Context.displayName = displayName;
    }
    return Context;
}
