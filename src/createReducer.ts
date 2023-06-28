import { produce as createNextState } from "immer";

export function createReducer<State, T extends Action>(
    initialState: State,
    actionTypeToReducer: ActionReducerMapping<State, T>,
    defaultReducer?: Reducer<State, T>,
): Reducer<State, T> {
    const isReducerAction = (a?: Action): a is ActionMatching<T, T["type"]> =>
        a !== undefined &&
        Object.prototype.hasOwnProperty.call(actionTypeToReducer, a.type);

    return function actionReducer(state = initialState, action?) {
        return createNextState(state, (mutableState: State) => {
            if (!isReducerAction(action)) {
                return defaultReducer?.(mutableState, action) ?? mutableState;
            }
            return actionTypeToReducer[action.type](mutableState, action);
        }) as State;
    };
}
