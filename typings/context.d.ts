type ContextDispatch<T extends string = string, P = unknown> = (
    action: Action<T, P>,
) => Action<T, P>;

type ContextEnhance<V extends ContextValue> = (value: V) => V;

// this is similar to a redux store
type ContextValue<S = unknown, T extends string = string, P = unknown> = {
    dispatch: ContextDispatch<T, P>;
    enhance: ContextEnhance<ContextValue<S, T, P>>;
    reducer: Reducer<S, T, P>;
    state: S;
};

type Context<
    S = unknown,
    T extends string = string,
    P = unknown
> = React.Context<ContextValue<S, T, P>>;
