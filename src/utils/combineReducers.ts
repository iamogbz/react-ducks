import { getKeys } from "./object";

export function combineReducers<
    CombinedState extends Record<string, unknown>,
    ReducerMapping extends Record<
        keyof CombinedState,
        Reducer<CombinedState[keyof CombinedState], T>
    >,
    T extends Action,
>(
    initialState: CombinedState,
    reducerMapping: ReducerMapping,
): Reducer<CombinedState, T> {
    const names = getKeys(initialState);
    return function (state = initialState, action) {
        return names.reduce(function reduce(newState, name) {
            newState[name] = reducerMapping[name](state[name], action);
            return newState;
        }, {} as CombinedState);
    };
}
