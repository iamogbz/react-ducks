export function createReducer<
    State,
    ActionType extends string = string,
    PayloadType = unknown
>(
    initialState: State,
    actionTypeToReducer: ReducerMapping<State, ActionType, PayloadType>,
    defaultReducer?: Reducer<State, ActionType, PayloadType>,
): Reducer<State, ActionType, PayloadType> {
    return (state = initialState, action?): State =>
        ((action && actionTypeToReducer[action.type]) ?? defaultReducer)?.(
            state,
            action,
        ) ?? state;
}
