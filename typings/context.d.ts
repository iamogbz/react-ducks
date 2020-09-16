type ContextDispatch<T extends string = string, P = unknown> = (
    action: Action<T, P>,
) => Action<T, P>;

type ContextEnhance<S = unknown, T extends string = string, P = unknown> = (
    value: ContextValue<S, T, P>,
) => ContextValue<S, T, P>;

interface ContextValue<S = unknown, T extends string = string, P = unknown>
    extends MiddlewareAPI<S, T, P> {
    enhancer?: ContextEnhance<S, T, P>;
    reducer: Reducer<S, T, P>;
    state: S;
}

type Context<
    S = unknown,
    T extends string = string,
    P = unknown
> = React.Context<ContextValue<S, T, P>>;
