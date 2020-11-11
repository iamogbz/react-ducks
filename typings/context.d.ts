type ContextDispatch<T extends string = string, P = unknown> = (
    action: Action<T, P>,
) => Promise<Action<T, P>>;

type ContextEnhance<S = unknown, T extends string = string, P = unknown> = (
    value: ContextValue<S, T, P>,
) => ContextValue<S, T, P>;

// this is similar to a redux store
type ContextValue<S = unknown, T extends string = string, P = unknown> = {
    enhancer?: ContextEnhance<S, T, P>;
    reducer: Reducer<S, Record<T, P>>;
    state: S;
} & MiddlewareAPI<S, T, P> &
    Omit<Observable, "constructor" | "from" | "of">;

type Context<
    S = unknown,
    T extends string = string,
    P = unknown
> = React.Context<ContextValue<S, T, P>>;
