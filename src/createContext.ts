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
    enhancer: ContextEnhancer<State> = idFn,
): Context<State> {
    const unimplemented = createUnimplemented(`Context(${displayName ?? ""})`);
    const Context = React.createContext<ContextValue<State>>({
        dispatch: idFn,
        enhancer,
        from: unimplemented("from"),
        of: unimplemented("of"),
        reducer: rootReducer,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        replaceReducer: <NewState>(r: Reducer<NewState>): Context<NewState> =>
            unimplemented("replaceReducer")(),
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
