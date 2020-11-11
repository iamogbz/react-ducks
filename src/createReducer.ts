import createNextState from "immer";

export function createReducer<S, T extends string, P>(
    initialState: S,
    actionTypeToReducer: ActionReducerMapping<S, T, P>,
    defaultReducer?: Reducer<S, T, P>,
): Reducer<S, T, P> {
    const isReducerActionType = (a?: Action<string, P>): a is Action<T, P> =>
        a !== undefined &&
        Object.prototype.hasOwnProperty.call(actionTypeToReducer, a.type);

    return function actionReducer(state = initialState, action?) {
        return createNextState(state, (mutableState: S) => {
            if (!isReducerActionType(action)) {
                return defaultReducer?.(mutableState, action) ?? mutableState;
            }
            return actionTypeToReducer[action.type](mutableState, action);
        }) as S;
    };
}
