import * as React from "react";

export function createContext<State>(
    rootReducer: Reducer<State>,
    preloadedState: State,
    displayName?: string,
): React.Context<ContextValue<State>> {
    const Context = React.createContext<ContextValue<State>>({
        dispatch: (a) => a,
        reducer: rootReducer,
        state: preloadedState,
    });
    if (displayName) {
        Context.displayName = displayName;
    }
    return Context;
}
