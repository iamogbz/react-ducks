type State = any; // eslint-disable-line @typescript-eslint/no-explicit-any

export function combineReducers<State>(
    initialState: Record<string, State>,
    reducerMapping: ReducerMapping<State>,
): Reducer<Record<string, State>> {
    const reducers = Object.entries(reducerMapping);
    return function (
        state: Record<string, State> = initialState,
        action,
    ): Record<string, State> {
        return reducers.reduce((acc, [name, reducer]) => {
            acc[name] = reducer(state[name], action);
            return acc;
        }, {} as Record<string, State>);
    };
}
