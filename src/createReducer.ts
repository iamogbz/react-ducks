const isActionType = (a: Action, mapping?: Record<string, unknown>): boolean =>
    Boolean(Object.prototype.hasOwnProperty.call(mapping, a.type));

export function createReducer<
    S,
    P,
    T extends U | V /* All action types the final reducer supports */,
    K extends ActionReducerMapping<
        S,
        U,
        P
    > /* Action types to reducer mapping */,
    L extends Record<V, U> /* Namespaced action types to original mapping */,
    U extends string,
    V extends string
>(
    initialState: S,
    actionTypeToReducer: K,
    namespacedActionTypeMapping?: L,
    defaultReducer?: Reducer<S, T, P>,
): Reducer<S, T, P> {
    const isReducerActionType = (a: Action<string, P>): a is Action<U, P> =>
        isActionType(a, actionTypeToReducer);
    const isNamespacedActionType = (a: Action<string, P>): a is Action<V, P> =>
        isActionType(a, namespacedActionTypeMapping);

    return (state = initialState, action?): S => {
        if (action !== undefined && isReducerActionType(action)) {
            return actionTypeToReducer[action.type](state, action);
        } else if (
            action !== undefined &&
            namespacedActionTypeMapping !== undefined &&
            isNamespacedActionType(action)
        ) {
            const actionType = namespacedActionTypeMapping[action.type];
            return actionTypeToReducer[actionType](state, {
                ...action,
                type: actionType,
            });
        }
        return defaultReducer?.(state, action) ?? state;
    };
}
