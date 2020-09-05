export function combineReducers<S, T extends string, P>(
    initialState: Record<string, S>,
    reducerMapping: ReducerMapping<S, T, P>,
): Reducer<Record<string, S>, T, P> {
    const reducers = Object.entries(reducerMapping);
    return function (
        state: Record<string, S> = initialState,
        action,
    ): Record<string, S> {
        return reducers.reduce((acc, [name, reducer]) => {
            acc[name] = reducer(state[name], action);
            return acc;
        }, {} as Record<string, S>);
    };
}
