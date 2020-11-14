type MiddlewareAPI<
    State = unknown,
    D extends ContextDispatch = ContextDispatch
> = {
    dispatch: D;
    getState: () => State;
};

type Middleware<
    State = unknown,
    D extends ContextDispatch = ContextDispatch
> = (api: MiddlewareAPI<State, D>) => (next: D) => D;
