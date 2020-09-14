export function createReducer<
    S,
    P,
    T extends string /* All action types the final reducer supports */
>(
    initialState: S,
    actionTypeToReducer: ActionReducerMapping<S, T, P>,
    defaultReducer?: Reducer<S, T, P>,
): Reducer<S, T, P> {
    const isReducerActionType = (a?: Action<string, P>): a is Action<T, P> =>
        a !== undefined &&
        Object.prototype.hasOwnProperty.call(actionTypeToReducer, a.type);

    return function actionReducer(state = initialState, action?): S {
        if (!isReducerActionType(action)) {
            return defaultReducer?.(state, action) ?? state;
        }
        return actionTypeToReducer[action.type](state, action);
    };
}
