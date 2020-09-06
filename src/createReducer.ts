export function createReducer<
    State,
    ActionType extends string = string,
    PayloadType = unknown
>(
    initialState: State,
    actionTypeToReducer: ReducerMapping<State, ActionType, PayloadType>,
    namespacedActionTypeMapping?: Record<string, string>,
    defaultReducer?: Reducer<State, ActionType, PayloadType>,
): Reducer<State, ActionType, PayloadType> {
    return (state = initialState, action?): State => {
        const actionType =
            (action && namespacedActionTypeMapping?.[action.type]) ??
            action?.type;
        return (
            (
                (action && actionTypeToReducer[actionType]) ??
                defaultReducer
            )?.(state, { ...action, type: actionType as ActionType }) ?? state
        );
    };
}
