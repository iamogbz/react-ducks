interface MiddlewareAPI<S = unknown, T extends string = string, P = unknown> {
    dispatch: ContextDispatch<T, P>;
    getState: () => S;
}

type Middleware<S = unknown, T extends string = string, P = unknown> = (
    api: MiddlewareAPI<S, T, P>,
) => (next: ContextDispatch<T, P>) => ContextDispatch<T, P>;
