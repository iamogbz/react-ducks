type ContextDispatch<T extends string = string, P = unknown> = (
    action: Action<T, P>,
) => Promise<Action<T, P>>;

type ContextEnhance<S = unknown, T extends string = string, P = unknown> = (
    value: ContextValue<S, T, P>,
) => ContextValue<S, T, P>;

interface ContextValue<S = unknown, T extends string = string, P = unknown>
    extends Readonly<MiddlewareAPI<S, T, P>> {
    readonly enhancer?: ContextEnhance<S, T, P>;
    readonly reducer: Reducer<S, T, P>;
    readonly state: S;
}

type Context<
    S = unknown,
    T extends string = string,
    P = unknown
> = React.Context<ContextValue<S, T, P>>;
