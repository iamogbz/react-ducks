export function createReducer<
    S,
    P,
    T extends U | V /* All action types the final reducer supports */,
    K extends ReducerMapping<S, U, P> /* Action types to reducer mapping */,
    L extends Record<V, U> /* Namespaced action types to original mapping */,
    U extends string = K extends infer _U /* All orignal action types */
        ? _U extends ReducerMapping<S, infer __U, P>
            ? __U
            : never
        : never,
    V extends string = L extends infer _V /* All namespaced action types */
        ? _V extends Record<infer __V, U>
            ? __V
            : never
        : never
>(
    initialState: S,
    actionTypeToReducer: K,
    namespacedActionTypeMapping?: L,
    defaultReducer?: Reducer<S, T, P>,
): Reducer<S, T, P> {
    function isReducerActionType(a: Action<string, P>): a is Action<U, P> {
        return Boolean(
            Object.prototype.hasOwnProperty.call(actionTypeToReducer, a.type),
        );
    }

    function isNamespacedActionType(a: Action<string, P>): a is Action<V, P> {
        return Boolean(
            Object.prototype.hasOwnProperty.call(
                namespacedActionTypeMapping,
                a.type,
            ),
        );
    }

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
