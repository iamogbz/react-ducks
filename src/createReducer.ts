export function createReducer<
    S,
    P,
    T extends string /* All action types the final reducer supports */,
    K extends ActionReducerMapping<
        S,
        T,
        P
    > /* Action types to reducer mapping */
>(
    initialState: S,
    actionTypeToReducer: K,
    defaultReducer?: Reducer<S, T, P>,
): Reducer<S, T, P> {
    const isReducerActionType = (a: Action<string, P>): boolean =>
        Boolean(
            Object.prototype.hasOwnProperty.call(actionTypeToReducer, a.type),
        );

    return (state = initialState, action?): S => {
        if (action === undefined || !isReducerActionType(action)) {
            return defaultReducer?.(state, action) ?? state;
        }
        return actionTypeToReducer[action.type](state, action);
    };
}
