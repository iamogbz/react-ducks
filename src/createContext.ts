import * as React from "react";
import { SymbolObservable } from "./utils/symbolObservable";
import { setGlobalContext } from "./components/Context";

class ContextValue<S = unknown, T extends string = string, P = unknown>
    implements ContextValue<S, T, P> {
    dispatch: ContextDispatch<T, P> = async (a) => a;
    enhancer?: ContextEnhance<S, T, P>;
    getState = (): S => this.state;
    reducer: Reducer<S, T, P>;
    state: S;

    constructor(
        value: Optional<ContextValue<S, T, P>, "dispatch" | "getState">,
    ) {
        this.enhancer = value.enhancer;
        this.reducer = value.reducer;
        this.state = value.state;
        if (value.dispatch) this.dispatch = value.dispatch;
        if (value.getState) this.getState = value.getState;
    }

    [SymbolObservable](): ContextValue<S, T, P> {
        throw new Error("Unimplemented method");
    }
}

export function createContextWithValue<S, T extends string, P>(
    value: Partial<ContextValue<S, T, P>>,
): Context<S, T, P> {
    return React.createContext(
        new ContextValue(value as ContextValue<S, T, P>),
    );
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
