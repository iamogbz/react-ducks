export function createReducer<State>(
    initialState: State,
    actionTypeToReducer: ReducerMapping<State>,
    defaultReducer?: Reducer<State>,
): Reducer<State> {
    return (state = initialState, action?): State =>
        ((action && actionTypeToReducer[action.type]) ?? defaultReducer)?.(
            state,
            action,
        ) ?? state;
}
