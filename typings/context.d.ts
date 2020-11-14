type ContextDispatch<T extends Action> = (action: T) => Promise<T>;

type ContextEnhance<State, T extends Action> = (
    value: ContextValue<State, T>,
) => ContextValue<State, T>;

// this is similar to a redux store
type ContextValue<State = unknown, T extends Action = Action> = {
    enhancer?: ContextEnhance<ContextValue<State, T>>;
    reducer: Reducer<State, T>;
    state: State;
} & MiddlewareAPI<State, ContextDispatch<T>> &
    Omit<Observable, "constructor" | "from" | "of">;

type Context<State = unknown, T extends Action = Action> = React.Context<
    ContextValue<State, T>
>;
