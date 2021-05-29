type ContextDispatch<T extends Action> = (action: T) => Promise<T>;

type ContextEnhance<State, T extends Action> = (
    value: ContextValue<State, T>,
) => ContextValue<State, T>;

// this is similar to a redux store
interface ContextValue<State = unknown, T extends Action = Action>
    extends MiddlewareAPI<State, ContextDispatch<T>>,
        Omit<Observable, "constructor" | "from" | "of"> {
    enhancer?: ContextEnhance<ContextValue<State, T>>;
    reducer: Reducer<State, T>;
    state: State;
}

type Context<State = unknown, T extends Action = Action> = React.Context<
    ContextValue<State, T>
>;
