import { getEntries } from "./object";

export function combineReducers<S, N extends string, T extends string, P>(
    initialState: Record<N, S>,
    reducerMapping: DuckReducerMapping<S, N, T, P>,
): Reducer<Record<N, S>, T, P> {
    const reducers = getEntries(reducerMapping);
    return function (state: Record<N, S> = initialState, action) {
        return reducers.reduce(function reduce(acc, [name, reducer]) {
            acc[name] = reducer(state[name], action);
            return acc;
        }, {} as Record<N, S>);
    };
}
